import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Doctor } from "../models/doctorSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";
import { Cita } from "../models/citaSchema.js";
import { Patient } from "../models/patientSchema.js";
import transporter from "../utils/nodeMailerConfig.js";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

export const Me = async (req, res, next) => {
  try {
    const doctor = req.user; //Autenticacion
    console.log(doctor.id);

    //buscarlo
    const verifyDoctor = await Doctor.findById(req.user.id);

    if (!verifyDoctor) {
      return next(new ErrorHandler("Doctor no encontrado", 404));
    }

    res.status(200).json({
      success: true,
      details: [verifyDoctor.nombre, verifyDoctor.email, verifyDoctor.role],
    });
  } catch (error) {
    next(error);
  }
};

export const EditProfile = async (req, res, next) => {
  try {
    const doctorId = req.user.id; // Autnteicacion

    const {
      nombre,
      apellido_pat,
      apellido_mat,
      telefono,
      email,
      especialidad,
      numero_licencia,
      newPassword,
      currentPassword,
    } = req.body;

    const { photo, licencia } = req.files || {};

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return next(new ErrorHandler("Doctor no encontrado", 404));
    }

    //Verificar por email usado
    if (email !== doctor.email) {
      const emailExist = await Doctor.findOne({ email });
      if (emailExist) {
        return next(
          new ErrorHandler("Email ya se encuentra en uso / registrado")
        );
      }
    }
    if (currentPassword && !(await doctor.comparePassword(currentPassword))) {
      return next(new ErrorHandler("La contraseña actual es incorrecta", 400));
    }

    // Actualizar la foto de perfil si se envió
    if (photo) {
      const photoCloudinaryResponse = await cloudinary.uploader.upload(
        photo.tempFilePath
      );

      if (!photoCloudinaryResponse || photoCloudinaryResponse.error) {
        return next(
          new ErrorHandler(
            "Fallo al subir la nueva foto del doctor a Cloudinary",
            500
          )
        );
      }

      // Borrar la foto anterior en Cloudinary si existe
      if (doctor.photo && doctor.photo.public_id) {
        //Por id
        await cloudinary.uploader.destroy(doctor.photo.public_id);
      }

      //Setear el campo con la respuesta de cloudinary
      doctor.photo = {
        public_id: photoCloudinaryResponse.public_id,
        url: photoCloudinaryResponse.secure_url,
      };
    }

    // Actualizar documento si se envió
    if (licencia) {
      const documentCloudinaryResponse = await cloudinary.uploader.upload(
        licencia.tempFilePath
      );

      if (!documentCloudinaryResponse || documentCloudinaryResponse.error) {
        return next(
          new ErrorHandler(
            "Fallo al subir licencia del doctor a Cloudinary",
            500
          )
        );
      }

      // Borrar documento anterior en Cloudinary si existe
      if (doctor.licencia && doctor.licencia.public_id) {
        //por id
        await cloudinary.uploader.destroy(doctor.licencia.public_id);
      }

      //Setear el campo con la respuesta de cloudinary
      doctor.licencia = {
        public_id: documentCloudinaryResponse.public_id,
        url: documentCloudinaryResponse.secure_url,
      };
    }

    // Actualizar los campos del paciente
    doctor.nombre = nombre || doctor.nombre;
    doctor.apellido_pat = apellido_pat || doctor.apellido_pat;
    doctor.apellido_mat = apellido_mat || doctor.apellido_mat;
    doctor.email = email || doctor.email;
    doctor.telefono = telefono || doctor.telefono;
    doctor.especialidad = especialidad || doctor.especialidad;
    doctor.numero_licencia = numero_licencia || doctor.numero_licencia;
    if (newPassword) {
      doctor.password = newPassword;
    }

    // Guardar los cambios
    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Perfil actualizado correctamente",
      doctor,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //encontar en doctor por email
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return next(new ErrorHandler("Doctor no encontrado", 400));
    }

    // Verificar Contraseña
    const isMatch = await doctor.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Credenciales incorrectas" });
    }

    generateToken(
      doctor,
      "Incio de Sesio Exitoso, credenciales melas",
      200,
      res
    );
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  res
    .status(200)
    .clearCookie("doctorToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      succes: true,
      message: "Sesion de doctor cerrada correctamente!!",
    });
};

export const getPatients = async (req, res, next) => {
  try {
    //id autenticado
    const doctorId = req.user.id;

    // Obtener los IDs unicos (no duplicados)se obtienen todos los idPaciente únicos donde el idDoctor coincide con el ID del doctor autenticado.
    const pacientesIds = await Cita.distinct("idPaciente", {
      idDoctor: doctorId,
    });

    // Por el campo _id de Pacientes buscar documentos donde coincida con los pacientesIds
    const pacientes = await Patient.find({ _id: { $in: pacientesIds } });

    res.status(200).json({
      success: true,
      pacientes,
    });
  } catch (error) {
    next(error);
  }
};

export const AddAllergie = async (req, res, next) => {
  try {
    const { id } = req.params; //url
    const { alergia } = req.body;

    if (!alergia) {
      return next(new ErrorHandler("Ingresa la alergia", 400));
    }

    const paciente = await Patient.findById(id);
    if (!paciente) {
      return next(new ErrorHandler("Paciente no encontrado", 404));
    }
    if (paciente.alergias.includes(alergia)) {
      return next(new ErrorHandler("Ya está registrada", 401));
    }

    // Añadir alergia
    paciente.alergias.push(alergia);

    await paciente.save();

    res.status(200).json({
      success: true,
      message: "Alergia añadida correctamente",
      alergias: paciente.alergias,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAllergie = async (req, res) => {
  try {
    const { id, index } = req.params; //URL

    const patient = await Patient.findById(id);
    if (!patient) {
      return next(new ErrorHandler("Paciente no encontrado", 404));
    }

    //En esa posicion eliminar 1 solo elemento
    patient.alergias.splice(index, 1);
    await patient.save();

    res.status(200).json({
      success: true,
      message: "Alergia eliminada correctamente",
      alergias: patient.alergias,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error del servidor", error });
  }
};

// export const generateReport = async (req, res, next) => {
//   try {
//     // Crear un nuevo documento PDF
//     const doc = new PDFDocument();

//     // Establecer los encabezados para la respuesta como archivo PDF
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       "attachment; filename=reporte_prueba.pdf"
//     );

//     // Pipe del documento PDF a la respuesta
//     doc.pipe(res);

//     // Contenido simple para el PDF de prueba
//     doc.fontSize(20).text("Reporte de Prueba", { align: "center" });
//     doc.moveDown(1);
//     doc
//       .fontSize(12)
//       .text("Este es un PDF de prueba generado desde el servidor.", {
//         align: "left",
//       });
//     doc.moveDown(1);
//     doc.fontSize(12).text("Aquí puedes agregar más contenido si lo deseas.", {
//       align: "left",
//     });
//     doc.moveDown(2);

//     const currentDate = new Date().toLocaleString();
//     doc.fontSize(10).text(`Generado el: ${currentDate}`, { align: "left" });

//     // Finalizar el documento PDF
//     doc.end();
//   } catch (error) {
//     console.error("Error en la generación del reporte:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error al generar el archivo de texto",
//     });
//   }
// };
