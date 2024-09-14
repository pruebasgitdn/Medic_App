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
    //Coger valores
    const {
      nombre,
      apellido_pat,
      apellido_mat,
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

    const { photo, document_id } = req.files; //Extraemos los archivos

    const allowedFormats = [
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/jpg",
    ]; //Formatos permitidos

    //Validaciones para los archivos foto y documento
    if (!photo || !allowedFormats.includes(photo.mimetype)) {
      return next(
        new ErrorHandler(
          !photo
            ? "Foto del paciente requerida!"
            : "Formato de archivo no soportado!",
          400
        )
      );
    }

    if (!document_id || !allowedFormats.includes(document_id.mimetype)) {
      return next(
        new ErrorHandler(
          !document_id
            ? "Foto documento del paciente requerida!"
            : "Formato de archivo no soportado!",
          400
        )
      );
    }

    if (
      !nombre ||
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
        new ErrorHandler("Porfavor llena todos los campos del form!!", 400)
      );
    }

    //Verificar si esta registrado
    const isRegistered = await Patient.findOne({ email });
    if (isRegistered) {
      return next(new ErrorHandler("Paciente con este email ya existe"));
    }

    //Sube el archivo temporal de photo acloudinary
    const photoCloudinaryResponse = await cloudinary.uploader.upload(
      photo.tempFilePath
    );

    //Si no se obtiene la respuesta o ocurrre un error entonces...
    if (!photoCloudinaryResponse || photoCloudinaryResponse.error) {
      console.error(
        "Error cloudinary:",
        photoCloudinaryResponse.error || "Error desconocido cloudinary"
      );
      return next(
        new ErrorHandler(
          "Fallo al subir la foto del paciente a cloudinary",
          500
        )
      );
    }

    //Sube el archivo temporal de document acloudinary
    const documentCloudinaryResponse = await cloudinary.uploader.upload(
      document_id.tempFilePath
    );

    if (!documentCloudinaryResponse || documentCloudinaryResponse.error) {
      console.error(
        "Error cloudinary:",
        documentCloudinaryResponse.error || "Error desconocido cloudinary"
      );
      return next(
        new ErrorHandler(
          "Fallo al subir el documento de ID del paciente a cloudinary",
          500
        )
      );
    }

    //Registrar paciente
    const user = await Patient.create({
      nombre,
      apellido_pat,
      apellido_mat,
      photo: {
        public_id: photoCloudinaryResponse.public_id,
        url: photoCloudinaryResponse.secure_url,
      },
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

    // // Verificar Contraseña
    // const isMatch = await bcrypt.compare(password, patient.password);

    // Verificar la contraseña sin encriptar
    if (password !== patient.password) {
      return res.status(400).json({ message: "Credenciales incorrectas" });
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
