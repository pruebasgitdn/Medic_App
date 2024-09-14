import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Cita } from "../models/citaSchema.js";
import { Doctor } from "../models/doctorSchema.js";
import { Patient } from "../models/patientSchema.js";

//CREAR CITA DEL PACIENTE
export const createAppointment = async (req, res, next) => {
  //El paciente  necesita  crear cita
  //Pasar paciente mediante la autenticacion middlware
  //Verificar que el doctor si se encuentre registrado
  try {
    const {
      fecha,
      hora,
      motivo,
      detallesDiagnostico,
      recomendaciones,
      nombre,
      apellido_pat,
    } = req.body;

    if (
      !fecha ||
      !hora ||
      !motivo ||
      !detallesDiagnostico ||
      !recomendaciones ||
      !nombre ||
      !apellido_pat
    ) {
      return next(
        new ErrorHandler("Porfavor llena el formulario completo!", 400)
      );
    }

    const doctor = await Doctor.find({
      nombre: nombre,
      apellido_pat: apellido_pat,
    });

    if (doctor.length === 0) {
      return next(new ErrorHandler("Doctor no encontrado", 404));
    }

    const idDoctor = doctor[0]._id;
    const idPaciente = req.user.id;

    const appointment = await Cita.create({
      idDoctor,
      idPaciente,
      fecha,
      hora,
      motivo,
      detallesDiagnostico,
      recomendaciones,
    });
    res.status(200).json({
      success: true,
      appointment,
      message: "Cita CREADA!",
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
        new ErrorHandler("No se encontraron citas para este paciente", 404)
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
      "nombre apellido_pat email "
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

//DOCTOR ACTUALIZA ESTADO DE CITA DE PENDIENTE A REALIZADA
export const updateStatus = async (req, res, next) => {
  try {
    const doctorId = req.user.id; //viene de la validacion
    const { id } = req.params; // id de los parametros URL

    //Buscar por el id de cita
    const appointment = await Cita.findOne({
      _id: id,
      idDoctor: doctorId,
    }).populate("idPaciente", "nombre apellido_pat email");

    if (!appointment) {
      return next(new ErrorHandler("Cita no encontrada o no autorizada", 404));
    }

    //================
    //Buscar al paciente por su ID para guardar en su historial
    const patient = await Patient.findById(appointment.idPaciente);

    if (!patient) {
      return next(new ErrorHandler("Paciente no encontrado", 404));
    }

    // Crear un nuevo reporte para agregar al historial del paciente
    const newReport = {
      idDoctor: appointment.idDoctor,
      idCita: appointment._id,
      motivo: appointment.motivo,
      fecha: appointment.fecha,
      detallesDiagnostico: appointment.detallesDiagnostico,
    };

    // Agregar el nuevo reporte al historial del paciente
    patient.reporte_historial.push(newReport);

    // Guardar los cambios en el paciente
    await patient.save();

    res.status(200).json({
      success: true,
      message:
        "El estado de la cita ha sido actualizado a 'REALIZADA' y el historial del paciente ha sido actualizado.",
      appointment,
    });

    //=================

    /* Actualizar el estado de la cita a "realizada"
    appointment.estado = "REALIZADA";

    // Guardar los cambios
    await appointment.save();

    res.status(200).json({
      success: true,
      message: "El estado de la cita ha sido actualizado a 'REALIZADA'",
      appointment,
    });
    */
  } catch (error) {
    next(error);
  }
};
