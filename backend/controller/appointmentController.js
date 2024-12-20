import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Cita } from "../models/citaSchema.js";
import { Doctor } from "../models/doctorSchema.js";
import { Patient } from "../models/patientSchema.js";
import transporter from "../utils/nodeMailerConfig.js";

// PACIENTE AGENDA UNA CITA
export const createAppointment = async (req, res, next) => {
  try {
    const { fecha, motivo, idDoctor, detallesAdicionales } = req.body;
    const idPaciente = req.user.id; // ID paciente autenticado

    // Campos obligatorios
    if (!fecha || !motivo || !idDoctor) {
      return next(
        new ErrorHandler("Por favor, llena todos los campos obligatorios.", 400)
      );
    }

    const appointmentDate = new Date(fecha);
    // Validar que la hora esté entre las 6:00 AM y las 11:00 PM
    const appointmentHour = appointmentDate.getHours();
    if (appointmentHour < 6 || appointmentHour >= 23) {
      return next(
        new ErrorHandler(
          "Las citas solo pueden crearse entre las 6:00 AM y las 11:00 PM.",
          400
        )
      );
    }

    // Fecha no anterior a la actual
    const today = new Date();
    if (new Date(fecha) < today) {
      return next(new ErrorHandler(`Ingrese una fecha válida`, 400));
    }

    // Verificar que el doctor existe
    const doctor = await Doctor.findById(idDoctor);
    if (!doctor) {
      return next(new ErrorHandler("Doctor no encontrado.", 404));
    }

    // Verificar que no haya citas en el mismo horario
    const startDate = new Date(fecha); // Fecha de inicio de la nueva cita
    const endDate = new Date(startDate.getTime() + 40 * 60000); // Duraciikn de 40 minutos

    // conlficto entre citas
    const conflictAppointments = await Cita.find({
      idDoctor,
      estado: { $nin: ["CANCELADA", "REALIZADA"] },
      $or: [
        { fecha: { $gte: startDate, $lt: endDate } },
        {
          fecha: {
            $lte: startDate,
            $gte: new Date(startDate.getTime() - 40 * 60000),
          },
        },
      ],
    });

    if (conflictAppointments.length > 0) {
      return next(
        new ErrorHandler(
          "El doctor ya tiene una cita agendada para esa hora.",
          400
        )
      );
    }

    // Crear  cita
    const appointment = await Cita.create({
      idDoctor,
      idPaciente,
      fecha,
      motivo,
      detallesAdicionales,
      estado: "PENDIENTE", // Estado inicial
    });

    // Correo  doctor
    const mailOptionsDoctor = {
      from: "<medelinknotificaciones@gmail.com>",
      to: doctor.email,
      subject: "Nueva Cita Agendada",
      text: `Hola Dr. ${doctor.nombre} ${doctor.apellido_pat},\n\nSe ha creado una nueva cita con el paciente ${req.user.nombre} para la fecha: ${fecha}.\n\nMotivo: ${motivo}.\n\nSaludos,\nEquipo de administración.`,
    };

    // Correo paciente
    const mailOptions = {
      from: "<medelinknotificaciones@gmail.com>",
      to: req.user.email, // Correo del paciente autenticado
      subject: "Confirmación de Creación de Cita",
      text: `Hola ${req.user.nombre},\n\nTu cita con el Dr. ${doctor.nombre} ${doctor.apellido_pat} ha sido creada exitosamente para la fecha: ${fecha}.\n\nMotivo: ${motivo}.\n\nSaludos,\nEquipo Médico`,
    };

    // Enviar correo  doctor
    transporter.sendMail(mailOptionsDoctor, (errorDoctor, infoDoctor) => {
      if (errorDoctor) {
        return res.status(500).json({
          message: "Error al enviar el correo al doctor",
          error: errorDoctor,
        });
      }

      // Enviar correo  paciente
      transporter.sendMail(mailOptions, (errorPaciente, infoPaciente) => {
        if (errorPaciente) {
          return res.status(500).json({
            message: "Error al enviar el correo de confirmación al paciente",
            error: errorPaciente,
          });
        }

        res.status(201).json({
          success: true,
          message: "Cita creada exitosamente y notificaciones enviadas.",
          appointment,
        });
      });
    });
  } catch (error) {
    next(error);
  }
};

//CONSULTAR CITAS DEL PACIENTE
export const checkAppointments = async (req, res, next) => {
  try {
    const patientId = req.user.id; //Auth

    const appointments = await Cita.find({ idPaciente: patientId }).populate(
      "idDoctor",
      "nombre apellido_pat apellido_mat especialidad photo"
    );
    //popular del idDoctor los sgtes campos de nombre apillo y especialed

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
    const doctorId = req.user.id; //auth

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
    const appointmentId = req.params.id; // URL
    const patientId = req.user.id; // ID  autenticado

    // Busca por ID y asegurar al paciente aut, ignorar cancelada
    const appointment = await Cita.findOne({
      _id: appointmentId,
      idPaciente: patientId,
      estado: { $ne: "CANCELADA" },
    })
      .populate("idDoctor", "nombre apellido_pat email")
      .populate("idPaciente", "nombre apellido_pat email");

    if (!appointment) {
      return next(new ErrorHandler("Cita no encontrada o ya cancelada", 404));
    }

    // Actualizar CANCELADA
    appointment.estado = "CANCELADA";
    await appointment.save();

    // Corro doctor
    const mailOptionsDoctor = {
      from: "<medelinknotificaciones@gmail.com>",
      to: appointment.idDoctor.email,
      subject: "Notificacion de Cancelacion de Cita",
      text: `Hola Dr. ${appointment.idDoctor.nombre} ,\n\nEl paciente ${appointment.idPaciente.nombre} ${appointment.idPaciente.apellido_pat} ha cancelado la cita programada para el dia ${appointment.fecha}. \n\nSaludos, Equipo de administración.`,
    };
    //Enviar
    transporter.sendMail(mailOptionsDoctor, (error, info) => {
      if (error) {
        return res.status(500).json({
          message: "Error al enviar el correo al doctor",
          error: error,
        });
      }
      res.status(200).json({
        success: true,
        message:
          "La cita ha sido cancelada exitosamente y el doctor ha sido notificado.",
        appointment,
      });
    });
  } catch (error) {
    next(error);
  }
};

// DOCTOR RESPONDE LA CITA Y ACTUALIZA SU ESTADO Y EL HISTORIAL DEL PACIENTE
export const respondAppointment = async (req, res, next) => {
  try {
    const doctorId = req.user.id; // ID del doctor aute
    const { id } = req.params; // ID de la cita URL
    const { detallesDiagnostico, recomendaciones } = req.body;

    // Buscar la cita por ID y doctor y popular por id sus campos
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
    const appointmentId = req.params.id; //URL
    const doctorId = req.user.id; // ID del doctor autenticado

    const { motivoCancelacion } = req.body;

    // Buscar la cita por ID
    const appointment = await Cita.findById(appointmentId).populate(
      "idPaciente",
      "nombre email"
    );
    if (!appointment) {
      return next(new ErrorHandler("Cita no encontrada o ya cancelada", 404));
    }

    // Cita pertenece al doctor autenticado
    if (appointment.idDoctor.toString() !== doctorId) {
      return next(
        new ErrorHandler("No tienes permiso para cancelar esta cita", 403)
      );
    }

    // Verificar cancelada
    if (appointment.estado === "CANCELADA") {
      return next(new ErrorHandler("La cita ya está cancelada", 400));
    }
    if (!motivoCancelacion) {
      return next(
        new ErrorHandler("El motivo de la cancelación es requerido.", 400)
      );
    }

    // Actualizar estado
    appointment.estado = "CANCELADA";
    await appointment.save();

    const mailOptions = {
      from: "medelinknotificaciones@gmail.com",
      to: appointment.idPaciente.email,
      subject: "Cancelacion de Cita",
      text: `Hola ${appointment.idPaciente.nombre},\n\nTu cita con el doctor ha sido cancelada. Motivo: ${motivoCancelacion}.\n\nSaludos,\nEquipo Médico`,
    };

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

export const adminCancelAppointment = async (req, res, next) => {
  try {
    const appointmentId = req.params.id; // URL
    const { motivoCancelacion } = req.body;

    // Cita por ID y popular los 2
    const appointment = await Cita.findById(appointmentId)
      .populate("idPaciente", "nombre email")
      .populate("idDoctor", "nombre apellido_pat email");

    if (!appointment) {
      return next(new ErrorHandler("Cita no encontrada o ya cancelada", 404));
    }

    // Verificar cancelada
    if (appointment.estado === "CANCELADA") {
      return next(new ErrorHandler("La cita ya está cancelada", 400));
    }
    if (!motivoCancelacion) {
      return next(
        new ErrorHandler("El motivo de la cancelación es requerido.", 400)
      );
    }

    // Actualizar a CAENCALRA
    appointment.estado = "CANCELADA";
    await appointment.save();

    // Correo al paciente
    const mailOptionsPaciente = {
      from: "<medelinknotificaciones@gmail.com>",
      to: appointment.idPaciente.email,
      subject: "Cancelacion de Cita",
      text: `Hola ${appointment.idPaciente.nombre},\n\nEl administrador le informa que su cita con el doctor ${appointment.idDoctor.nombre} ${appointment.idDoctor.apellido_pat} ha sido cancelada. Motivo: ${motivoCancelacion}.\n\nSaludos,\nEquipo de administración.`,
    };

    // Correo al doctor
    const mailOptionsDoctor = {
      from: "<medelinknotificaciones@gmail.com>",
      to: appointment.idDoctor.email,
      subject: "Notificacion de Cancelacion de Cita",
      text: `Hola Dr. ${appointment.idDoctor.nombre} ${appointment.idDoctor.apellido_pat},\n\nAdministración le informa que la cita con el paciente ${appointment.idPaciente.nombre} ha sido cancelada. Motivo: ${motivoCancelacion}.\n\nSaludos,\nEquipo de administración.`,
    };

    // Correo paciente
    transporter.sendMail(mailOptionsPaciente, (error, info) => {
      if (error) {
        return res.status(500).json({
          message: "Error al enviar el correo al paciente",
          error: error,
        });
      }

      // Correo doctor
      transporter.sendMail(mailOptionsDoctor, (error, info) => {
        if (error) {
          return res.status(500).json({
            message: "Error al enviar el correo al doctor",
            error: error,
          });
        }

        res.status(200).json({
          message: "Cita cancelada y notificaciones enviadas correctamente",
        });
      });
    });
  } catch (error) {
    next(error);
  }
};

export const doctorSendEmailPatient = async (req, res, next) => {
  try {
    const patientId = req.params.id; //URL
    const doctor = req.user.id; // ID del doctor autenticado

    const { contenido, asunto } = req.body;
    const { file } = req.files || {};

    if (!contenido || !asunto) {
      return next(new ErrorHandler("Ingrese los campos requeridos", 400));
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return next(new ErrorHandler("Paciente no encontrado", 404));
    }

    // Correo al paciente
    const mailOptionsPaciente = {
      from: doctor.email,
      to: patient.email,
      subject: asunto,
      text: `Hola ${patient.nombre}.\n\n 
      ${contenido}
      \n\nSaludos.\n`,
      attachments: file
        ? [
            {
              filename: file.name, //nombre arcihvo
              path: file.path, //ruta archivo
              contentType: file.mimetype, //Tipo de contenido
            },
          ]
        : [], // Si no entonces vacio
    };

    // Correo paciente
    transporter.sendMail(mailOptionsPaciente, (error, info) => {
      if (error) {
        return res.status(500).json({
          message: "Error al enviar el correo al paciente",
          error: error,
        });
      }
      res.status(200).json({
        success: true,
        message: "Correo enviado correctamente",
      });
    });
  } catch (error) {
    next(error);
  }
};

export const getAppointmentsByDate = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Inicio del dia 12:00:00 a partir de ahi busca

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Inicio del día siguiente a las 00:00:00, buscar hasta aca

    // Buscar citas solo para el día actual
    const appointments = await Cita.find({
      fecha: {
        $gte: today, // Desde el inicio del día actual
        $lt: tomorrow, // Hasta el inicio del día siguiente
      },
      estado: { $nin: ["CANCELADA", "REALIZADA"] }, // Solo pendietne
    }).populate(
      "idDoctor",
      "nombre apellido_pat apellido_mat especialidad photo"
    );

    if (!appointments || appointments.length === 0) {
      return next(
        new ErrorHandler("No se encontraron citas para el día de hoy", 200)
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

export const editAppointment = async (req, res, next) => {
  try {
    const { fecha } = req.body;
    const idPaciente = req.user.id; //paciente autenticado
    const nombrePati = req.user.nombre;
    const id = req.params.id; // ID CITA URL

    if (!fecha) {
      return next(new ErrorHandler("Ingrese la fecha", 400));
    }

    // cit apor id
    const appointment = await Cita.findById(id).populate("idDoctor");

    if (!appointment || appointment.idPaciente.toString() !== idPaciente) {
      return next(
        new ErrorHandler("Cita no encontrada o no pertenece al paciente", 404)
      );
    }

    // validar fecha y horario labor
    const newAppointmentDate = new Date(fecha);
    const appointmentHour = newAppointmentDate.getHours();
    if (appointmentHour < 6 || appointmentHour >= 23) {
      return next(
        new ErrorHandler(
          "Las citas solo pueden programarse entre las 6:00 AM y las 11:00 PM.",
          400
        )
      );
    }

    // no fecha anterior
    const today = new Date();
    if (newAppointmentDate < today) {
      return next(new ErrorHandler("Ingrese una fecha futura válida", 400));
    }

    // Definir el rango de tiempo de la nueva cita
    const startDate = new Date(fecha);
    const endDate = new Date(startDate.getTime() + 40 * 60000); // 40 minutos

    /*
nin not in excluir las cancelada y realziada
ne not equal no igual a esa exlcuir tambien
lt mens que, gt mas que => verifica el solapamientod  citas en 40 min
*/
    const conflictExists = await Cita.find({
      idDoctor: appointment.idDoctor,
      estado: { $nin: ["CANCELADA", "REALIZADA"] },
      _id: { $ne: id },
      $or: [
        { fecha: { $gte: startDate, $lt: endDate } },
        {
          fecha: {
            $lte: startDate,
            $gte: new Date(startDate.getTime() - 40 * 60000),
          },
        },
      ],
    });

    if (conflictExists.length > 0) {
      return next(
        new ErrorHandler(
          "El doctor ya tiene una cita agendada para esa hora.",
          400
        )
      );
    }
    // Correo  doctor
    const mailOptionsDoctor = {
      from: "<medelinknotificaciones@gmail.com>",
      to: appointment.idDoctor.email,
      subject: "Modificacion de Cita",
      text: `Hola Dr. ${
        appointment.idDoctor.nombre
      }.\n\nSe le informa que el paciente: ${nombrePati} ha modificado la fecha de la cita para el día: ${new Date(
        fecha
      ).toLocaleString()}.\n\nSaludos.\nEquipo de administración.`,
    };

    transporter.sendMail(mailOptionsDoctor, (errorDoctor, infoDoctor) => {
      if (errorDoctor) {
        return res.status(500).json({
          message: "Error al enviar el correo al doctor",
          error: errorDoctor,
        });
      }

      res.status(200).json({
        success: true,
        message: "Cita actualizada exitosamente.",
        appointment,
      });
    });

    // actualizar
    appointment.fecha = fecha;
    await appointment.save();
  } catch (error) {
    next(error);
  }
};
