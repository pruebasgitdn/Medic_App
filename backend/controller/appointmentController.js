import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Cita } from "../models/citaSchema.js";
import { Doctor } from "../models/doctorSchema.js";
import { Patient } from "../models/patientSchema.js";
import transporter from "../utils/nodeMailerConfig.js";

// PACIENTE AGENDA UNA CITA
export const createAppointment = async (req, res, next) => {
  try {
    //Extrear valores
    const { fecha, motivo, idDoctor, detallesAdicionales } = req.body;
    const idPaciente = req.user.id; // ID del paciente autenticado

    // Validar campos obligatorios
    if (!fecha || !motivo || !idDoctor) {
      return next(
        new ErrorHandler("Por favor, llena todos los campos obligatorios.", 400)
      );
    }

    // Verificar que el doctor existe
    const doctor = await Doctor.findById(idDoctor);

    if (!doctor) {
      return next(new ErrorHandler("Doctor no encontrado.", 404));
    }

    // Verificar que no haya citas que se esten en el mismo horario
    const startDate = new Date(fecha); // Fecha de inicio de la nueva cita
    const endDate = new Date(startDate.getTime() + 40 * 60000); // Obtenemos la fecha de inicio y agregamos 40 minutos de duración a la cita para la duracion el final - 40 min

    // Buscar citas que se esten en el horario del doctor
    /* 
    mongo operadores
    $ne (not equal): no  excluir las 'CANCELADA'
    $gte (grether than) masn que
    $lt (less tahn) menos que
    lo que hace un intervalo de busqueda en la fecha
    */
    const conflictAppointments = await Cita.find({
      idDoctor,
      estado: { $ne: "CANCELADA" }, // Ignorar las citas canceladas
      fecha: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    if (conflictAppointments.length > 0) {
      return next(
        new ErrorHandler(
          "El doctor ya tiene una cita agendada para esa hora.",
          400
        )
      );
    }

    // Crear la cita
    const appointment = await Cita.create({
      idDoctor,
      idPaciente,
      fecha, //En la API meter CON FORMATO ISO 8601
      motivo,
      detallesAdicionales,
      estado: "PENDIENTE", // Estado inicial
    });

    res.status(201).json({
      success: true,
      message: "Cita creada exitosamente.",
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

//CONSULTAR CITAS DEL PACIENTE
export const checkAppointments = async (req, res, next) => {
  try {
    const patientId = req.user.id; //ID del user autenticado by middleware

    //busqueda en citas por el id del paciente
    const appointments = await Cita.find({ idPaciente: patientId }).populate(
      "idDoctor",
      "nombre apellido_pat apellido_mat especialidad"
    );
    //popular del idDoctor que es la conexiona la otra tabla, los sgtes campos de nombre apillo y especialed

    if (!appointments || appointments.length === 0) {
      return next(
        new ErrorHandler("No se encontraron citas para este paciente", 200)
      );
    }
    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    next(error);
  }
};

//CONSULTAR CITAS DEL DOCTOR
export const getDoctorAppointments = async (req, res, next) => {
  try {
    const doctorId = req.user.id; //Viene de la autententicacion del middleware

    const appointments = await Cita.find({ idDoctor: doctorId }).populate(
      "idPaciente",
      "nombre apellido_pat email photo"
    );

    if (!appointments || appointments.length === 0) {
      return next(
        new ErrorHandler("No se encontraron citas para este doctor", 404)
      );
    }

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    next(error);
  }
};

//PACIENTE CANCELA CITA
export const cancelAppointment = async (req, res, next) => {
  try {
    const appointmentId = req.params.id; // ID de la cita de los parámetros  URL
    const patientId = req.user.id; // ID del paciente autenticado

    // Busca por ID y asegurar que pertenece al paciente autenticado
    const appointment = await Cita.findOne({
      _id: appointmentId,
      idPaciente: patientId, // Verificar que el paciente sea el dueño de la cita
      estado: { $ne: "CANCELADA" }, // No permitir cancelar si ya está cancelada
    });

    if (!appointment) {
      return next(new ErrorHandler("Cita no encontrada o ya cancelada", 404));
    }

    // Actualizar el estado de la cita a "CANCELADA"
    appointment.estado = "CANCELADA";
    await appointment.save();

    res.status(200).json({
      success: true,
      message: "La cita ha sido cancelada exitosamente.",
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

// DOCTOR RESPONDE LA CITA Y ACTUALIZA SU ESTADO Y EL HISTORIAL DEL PACIENTE
export const respondAppointment = async (req, res, next) => {
  try {
    const doctorId = req.user.id; // ID del doctor autenticado
    const { id } = req.params; // ID de la cita
    const { detallesDiagnostico, recomendaciones } = req.body;

    // Buscar la cita por ID y doctor
    const appointment = await Cita.findOne({
      _id: id,
      idDoctor: doctorId,
    }).populate("idPaciente", "nombre apellido_pat email");

    if (!appointment) {
      return next(new ErrorHandler("Cita no encontrada o no autorizada", 404));
    }

    // SOLO CITAS PENDIENTES
    if (
      appointment.estado === "CANCELADA" ||
      appointment.estado === "REALIZADA"
    ) {
      return next(
        new ErrorHandler(
          "No se puede responder a esta cita porque ya ha sido cancelada o realizada",
          400
        )
      );
    }

    // Actualizar el estado y detalles de la cita
    appointment.estado = "REALIZADA";
    appointment.detallesDiagnostico = detallesDiagnostico;
    appointment.recomendaciones = recomendaciones;
    await appointment.save();

    // Encontrar id del paciente para actualizar el historial
    const patient = await Patient.findById(appointment.idPaciente);

    if (!patient) {
      return next(new ErrorHandler("Paciente no encontrado", 404));
    }

    const newReport = {
      idDoctor: appointment.idDoctor,
      idCita: appointment._id,
      motivo: appointment.motivo,
      fecha: appointment.fecha,
      detallesDiagnostico: appointment.detallesDiagnostico,
      recomendaciones: appointment.recomendaciones,
    };

    // Añadir el reporte al historial
    patient.reporte_historial.push(newReport);
    await patient.save();

    res.status(200).json({
      success: true,
      message: "Cita realizada y paciente actualizado.",
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

export const doctorCancelAppointment = async (req, res, next) => {
  try {
    const appointmentId = req.params.id;
    const doctorId = req.user.id; // ID del doctor autenticado

    const { motivoCancelacion } = req.body; // Motivo de la cancelación

    // Buscar la cita por ID y doctor

    // Buscar la cita por ID
    const appointment = await Cita.findById(appointmentId).populate(
      "idPaciente",
      "nombre email"
    );

    if (!appointment) {
      return next(new ErrorHandler("Cita no encontrada o ya cancelada", 404));
    }

    // Verificar que la cita pertenece al doctor autenticado
    if (appointment.idDoctor.toString() !== doctorId) {
      return next(
        new ErrorHandler("No tienes permiso para cancelar esta cita", 403)
      );
    }

    // Verificar si ya está cancelada
    if (appointment.estado === "CANCELADA") {
      return next(new ErrorHandler("La cita ya está cancelada", 400));
    }
    if (!motivoCancelacion) {
      return next(
        new ErrorHandler("El motivo de la cancelación es requerido.", 400)
      );
    }

    // Actualizar el estado de la cita a "CANCELADA"
    appointment.estado = "CANCELADA";
    await appointment.save();

    const mailOptions = {
      from: "medelinknotificaciones@gmail.com",
      to: appointment.idPaciente.email,
      subject: "Cancelación de Cita",
      text: `Hola ${appointment.idPaciente.nombre},\n\nTu cita con el doctor ha sido cancelada. Motivo: ${motivoCancelacion}.\n\nSaludos,\nEquipo Médico`,
    };

    // Enviar el correo
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res
          .status(500)
          .json({ message: "Error al enviar el correo", error: error });
      }
      res.status(200).json({
        message: "Cita cancelada y notificación enviada correctamente",
      });
    });
  } catch (error) {
    next(error);
  }
};
