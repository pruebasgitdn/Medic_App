import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Patient } from "../models/patientSchema.js";
import { Doctor } from "../models/doctorSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";
/* 
Iniciar Sesion
Registrarse
Cerrar Sesion
Crear Cita
Editar Perfil
Ver Hitorial (realizadas, canceladas)
Pagar Cita
Ver Citas (pendientes)

*/

export const patientRegister = async (req, res, next) => {
  try {
    // Coger valores
    const {
      nombre,
      apellido_pat,
      apellido_mat,
      dot,
      email,
      password,
      telefono,
      genero,
      direccion,
      nombre_contacto_emergencia,
      numero_contacto_emergencia,
      proovedor_seguros,
      alergias,
      historial_medico,
      reporte_historial,
      identificacion_tipo,
      identificacion_numero,
      identificacion_url,
    } = req.body;

    const { document_id, photo } = req.files || {}; // Extraemos los archivos

    // Validar campos requeridos
    if (
      !nombre ||
      !dot ||
      !apellido_mat ||
      !apellido_pat ||
      !email ||
      !password ||
      !telefono ||
      !genero ||
      !direccion ||
      !nombre_contacto_emergencia ||
      !numero_contacto_emergencia ||
      !proovedor_seguros ||
      !identificacion_tipo
    ) {
      return next(
        new ErrorHandler(
          "Por favor llena todos los campos del formulario!",
          400
        )
      );
    }

    // Verificar si ya está registrado
    const isRegistered = await Patient.findOne({ email });
    if (isRegistered) {
      return next(new ErrorHandler("Paciente con este email ya existe", 400));
    }

    // Validar que se suba el documento ID
    if (!document_id) {
      return next(new ErrorHandler("Sube tu documento de ID", 400));
    }

    // Subir el archivo temporal de document a Cloudinary
    const documentCloudinaryResponse = await cloudinary.uploader.upload(
      document_id.tempFilePath
    );

    if (!documentCloudinaryResponse || documentCloudinaryResponse.error) {
      console.error(
        "Error en Cloudinary:",
        documentCloudinaryResponse.error || "Error desconocido en Cloudinary"
      );
      return next(
        new ErrorHandler(
          "Fallo al subir el documento de ID del paciente a Cloudinary",
          500
        )
      );
    }

    // Inicializar el objeto para la foto
    let photoData = null;

    // Si la foto existe, validar formato y subirla a Cloudinary
    if (photo) {
      const allowedFormats = ["image/png", "image/jpeg", "image/webp"];

      if (!allowedFormats.includes(photo.mimetype)) {
        return next(
          new ErrorHandler("Formato de archivo de la foto no soportado!", 400)
        );
      }

      // Subir la foto a Cloudinary
      const photoCloudinaryResponse = await cloudinary.uploader.upload(
        photo.tempFilePath
      );

      if (!photoCloudinaryResponse || photoCloudinaryResponse.error) {
        console.error(
          "Error en Cloudinary:",
          photoCloudinaryResponse.error || "Error desconocido en Cloudinary"
        );
        return next(
          new ErrorHandler(
            "Fallo al subir la foto del paciente a Cloudinary",
            500
          )
        );
      }

      // Guardar datos de la foto si se subió correctamente
      photoData = {
        public_id: photoCloudinaryResponse.public_id,
        url: photoCloudinaryResponse.secure_url,
      };
    }

    // Registrar paciente
    const user = await Patient.create({
      nombre,
      apellido_pat,
      apellido_mat,
      dot,
      ...(photoData && { photo: photoData }), // Solo incluir la foto si existe
      document_id: {
        public_id: documentCloudinaryResponse.public_id,
        url: documentCloudinaryResponse.secure_url,
      },
      email,
      password,
      telefono,
      genero,
      direccion,
      nombre_contacto_emergencia,
      numero_contacto_emergencia,
      proovedor_seguros,
      alergias,
      historial_medico,
      reporte_historial,
      identificacion_tipo,
      identificacion_numero,
      identificacion_url,
    });

    generateToken(user, "PACIENTE creado correctamente", 200, res);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Encontrar paciente por email
    const patient = await Patient.findOne({ email });
    if (!patient) {
      return next(new ErrorHandler("Paciente no encontrado", 400));
    }

    //Verificar Contraseña
    const isMatch = await patient.comparePassword(password);
    if (!isMatch) {
      return next(new ErrorHandler("Credenciales incorrectas", 400));
    }

    generateToken(
      patient,
      "Incio de Sesio Exitoso, credenciales melas",
      200,
      res
    );
  } catch (error) {
    next(error);
  }
};

export const getAllDoctors = async (req, res, next) => {
  const doctors = await Doctor.find();
  res.status(200).json({
    success: true,
    doctors,
  });
};

export const getPatientDetails = async (req, res, next) => {
  try {
    //Req.user proveniente del middleware de autenticacion previamante para pasar a esta ruta en el router del admin
    const patient = req.user;
    console.log(patient.id);

    //Verificamos con la coleccion Admin en la tabla de datos
    const verifyPatient = await Patient.findById(req.user.id);

    //Si no lo encuentra
    if (!verifyPatient) {
      return next(new ErrorHandler("Paciente no encontrado", 404));
    }

    //Si lo encuentra
    res.status(200).json({
      success: true,
      details: [verifyPatient.nombre, verifyPatient.email, verifyPatient.role],
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  res
    .status(200)
    .cookie("patientToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      succes: true,
      message: "Sesion de paciente cerrada correctamente!!",
    });
};

export const getHistory = async (req, res, next) => {
  try {
    // Obtener el paciente autenticado desde `req.user`
    const patient = await Patient.findById(req.user.id).populate({
      path: "reporte_historial.idDoctor",
      select: "nombre apellido_pat apellido_mat",
    });

    // Verificar si el paciente existe
    if (!patient) {
      return next(new ErrorHandler("Paciente no encontrado", 404));
    }

    // Devolver el historial de reportes del paciente
    res.status(200).json({
      success: true,
      historial: patient.reporte_historial,
    });
  } catch (error) {
    next(error);
  }
};

export const EditProfile = async (req, res, next) => {
  try {
    const patientId = req.user.id; // ID del paciente autenticado

    // Obtener los datos que el paciente desea actualizar
    const {
      nombre,
      apellido_pat,
      apellido_mat,
      telefono,
      email,
      direccion,
      genero,
      alergias,
    } = req.body;

    const { photo, document_id } = req.files || {};

    // Buscar el paciente
    const patient = await Patient.findById(patientId);

    if (!patient) {
      return next(new ErrorHandler("Paciente no encontrado", 404));
    }

    //Verificar por email usado
    if (email !== patient.email) {
      const emailExist = await Patient.findOne({ email });
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
            "Fallo al subir la nueva foto del paciente a Cloudinary",
            500
          )
        );
      }

      // Borrar la foto anterior en Cloudinary si existe
      if (patient.photo.public_id) {
        //cloud.uploaded.destoy => metodo para eliminar, el .public_id => que es el id de la foto en cloudinaty
        await cloudinary.uploader.destroy(patient.photo.public_id);
      }

      patient.photo = {
        public_id: photoCloudinaryResponse.public_id,
        url: photoCloudinaryResponse.secure_url,
      };
    }

    // Actualizar documento si se envió
    if (document_id) {
      //cloud.uploaded.upload => metodo para subir, el .tempFilePath => que es la ruta temporal de la foto
      const documentCloudinaryResponse = await cloudinary.uploader.upload(
        document_id.tempFilePath
      );

      if (!documentCloudinaryResponse || documentCloudinaryResponse.error) {
        return next(
          new ErrorHandler(
            "Fallo al subir el documento del paciente a Cloudinary",
            500
          )
        );
      }

      // Borrar documento anterior en Cloudinary si existe
      if (patient.document_id.public_id) {
        //cloud.uploaded.destoy => metodo para eliminar, el .public_id => que es el id de la foto en cloudinaty
        await cloudinary.uploader.destroy(patient.document_id.public_id);
      }

      patient.document_id = {
        public_id: documentCloudinaryResponse.public_id,
        url: documentCloudinaryResponse.secure_url,
      };
    }

    // Actualizar los campos del paciente
    patient.nombre = nombre || patient.nombre;
    patient.email = email || patient.email;
    patient.apellido_pat = apellido_pat || patient.apellido_pat;
    patient.apellido_mat = apellido_mat || patient.apellido_mat;
    patient.telefono = telefono || patient.telefono;
    patient.direccion = direccion || patient.direccion;
    patient.genero = genero || patient.genero;
    patient.alergias = alergias || patient.alergias;

    // Guardar los cambios
    await patient.save();

    res.status(200).json({
      success: true,
      message: "Perfil actualizado correctamente",
      patient,
    });
  } catch (error) {
    next(error);
  }
};
