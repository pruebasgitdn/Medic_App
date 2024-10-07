import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Doctor } from "../models/doctorSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";
import { Cita } from "../models/citaSchema.js";
import { Patient } from "../models/patientSchema.js";

/* 
Iniciar Sesion
Cerrar Sesion
Crear Doctor => 
  Esta función crearía un nuevo registro de doctor en la base de datos, incluyendo la validación de la licencia/documento y la generación de una contraseña.
  Entradas: Datos del doctor (nombre, número de licencia, etc.).
  Salidas: Confirmación de la solicitud y se dara revision al registro en unos dias para el registro exitoso!!.


Actualizar Doctor => 
  Permitiría a los administradores o al mismo doctor actualizar su información, como sus credenciales o su historial de pacientes atendidos.

  Entradas: ID del doctor, datos actualizados.
  Salidas: Confirmación de la actualización o errores.

AñadirHistorialPaciente => 
  Esta función se encargaría de registrar que un doctor ha atendido a un paciente. Incluiría detalles del reporte y del caso.
  Entradas: ID del doctor, detalles del paciente (ID del paciente, nombre, reporte, detalles del caso).
  Salidas: Confirmación de la adición o errores.

getPatientHistory =>( historial de pacientes atendidos por un doctor)
  Descripción: Permitiría al doctor o al administrador ver el historial completo de los pacientes atendidos por ese doctor.
  Entradas: ID del doctor.
  Salidas: Lista de historiales de pacientes atendidos.





*/

export const Me = async (req, res, next) => {
  try {
    //Req.user proveniente del middleware de autenticacion previamante para pasar a esta ruta en el router del admin
    const doctor = req.user;
    console.log(doctor.id);

    //Verificamos con la coleccion Admin en la tabla de datos
    const verifyDoctor = await Doctor.findById(req.user.id);

    //Si no lo encuentra
    if (!verifyDoctor) {
      return next(new ErrorHandler("Doctor no encontrado", 404));
    }

    //Si lo encuentra
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
    const doctorId = req.user.id; // ID del doctor autenticado

    // Obtener los datos que el doctor desea actualizar
    const {
      nombre,
      apellido_pat,
      apellido_mat,
      telefono,
      email,
      especialidad,
      numero_licencia,
    } = req.body;

    const { photo, licencia } = req.files || {};

    // Buscar el dr
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

    // Actualizar la foto de perfil si se envió
    if (photo) {
      //cloud.uploaded.upload => metodo para subir, el .tempFilePath => que es la ruta temporal de la foto
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
        //cloud.uploaded.destoy => metodo para eliminar, el .public_id => que es el id de la foto en cloudinaty
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
      //cloud.uploaded.upload => metodo para subir, el .tempFilePath => que es la ruta temporal de la foto
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
        //cloud.uploaded.destoy => metodo para eliminar, el .public_id => que es el id de la foto en cloudinaty
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
  const { email, password } = req.body;
  try {
    // Encontrar paciente por email
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return next(new ErrorHandler("Doctor no encontrado", 400));
    }

    // // Verificar Contraseña
    // const isMatch = await bcrypt.compare(password, patient.password);

    // Verificar la contraseña sin encriptar
    if (password !== doctor.password) {
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

    // Obtener los IDs únicos de los idspacientes en las citas del doctor que coincidan con el campoidDoctor en cita del dr autentic...
    const pacientesIds = await Cita.distinct("idPaciente", {
      idDoctor: doctorId,
    });

    // Buscar detalles de todos los pacientes relacionados con esos IDs únicos
    const pacientes = await Patient.find({ _id: { $in: pacientesIds } });

    res.status(200).json({
      success: true,
      pacientes, // Lista de pacientes con toda su información obtenida directamente
    });
  } catch (error) {
    next(error);
  }
};
