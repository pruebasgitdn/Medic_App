import { Message } from "../models/messageSchema.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Doctor } from "../models/doctorSchema.js";
import { Admin } from "../models/adminSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

/* 
Iniciar Sesion
Cerrar Sesion
Crear Admin
Eliminar Cuenta (Propia)
EditarPerfil
EliminarUsuario
EliminarDoctor
EliminarCitas

*/

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Encontrar paciente por email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return next(new ErrorHandler("Admin no encontrado", 400));
    }

    // // Verificar Contraseña
    // const isMatch = await bcrypt.compare(password, patient.password);

    // Verificar la contraseña sin encriptar
    if (password !== admin.password) {
      return res.status(400).json({ message: "Credenciales incorrectas" });
    }
    generateToken(
      admin,
      "Incio de Sesio Exitoso, credenciales melas",
      200,
      res
    );
  } catch (error) {
    next(error);
  }
};

export const createAdmin = async (req, res, next) => {
  const { nombre, email, password, role } = req.body;
  try {
    //req.files objeto que contiene los archivos enviados en una solicitud
    const { photo } = req.files; //Extraemos el photo

    const allowedFormats = ["image/png", "image/jpeg", "image/webp"]; //Formatos permitidos

    /*
    Si no existe la photo o  si la photo no incluye el tipo de formatos permitidos entonces el manejador de error hace lo siguigiente: si foto no exste entonces foto del dr requerido de otro modo (si la photo no incluye el tipo de formatos permitidos) entonces formtato archivo no sportado, err 400
    */
    if (!photo || !allowedFormats.includes(photo.mimetype)) {
      return next(
        new ErrorHandler(
          !photo
            ? "Foto del doctor requerida!"
            : "Formato de archivo no soportado!",
          400
        )
      );
    }

    if (!nombre || !email || !password || !role || !photo) {
      return next(
        new ErrorHandler("Porfavor llena todos los campos del form!!", 400)
      );
    }

    //Verificar si esta registrado
    const isRegistered = await Admin.findOne({ email });
    if (isRegistered) {
      return next(new ErrorHandler("Administrador con este email ya existe"));
    }

    //Sube el archivo temporal de photo
    const cloudinaryResponse = await cloudinary.uploader.upload(
      photo.tempFilePath
    );

    //Si no se obtiene la respuesta o ocurrre un error entonces...
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(
        "Error cloudinary:",
        cloudinaryResponse.error || "Error desconocido cloudinary"
      );
      return next(
        new ErrorHandler(
          "Fallo al subir la imagen del doctor a cloudinary",
          500
        )
      );
    }

    const admin = await Admin.create({
      nombre,
      email,
      password,
      photo: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
      role,
    });
    generateToken(admin, "Admin creado correctamente", 200, res);
  } catch (error) {
    next(error);
  }
};

export const createDoctor = async (req, res, next) => {
  try {
    const {
      nombre,
      apellido_pat,
      apellido_mat,
      especialidad,
      telefono,
      email,
      password,
      numero_licencia,
      patientHistory,
    } = req.body; //Ectraer Valores

    const { photo, licencia } = req.files; //Extraemos los archivos

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
            ? "Foto del doctor requerida!"
            : "Formato de archivo no soportado!",
          400
        )
      );
    }
    if (!licencia || !allowedFormats.includes(licencia.mimetype)) {
      return next(
        new ErrorHandler(
          !licencia
            ? "Licencia del doctor requerida!"
            : "Formato de archivo no soportado!",
          400
        )
      );
    }

    if (
      !nombre ||
      !apellido_pat ||
      !apellido_mat ||
      !especialidad ||
      !telefono ||
      !email ||
      !password ||
      !numero_licencia
    ) {
      return next(
        new ErrorHandler("Porfavor llena todos los campos del form!!", 400)
      );
    }

    //Verificar si esta registrado
    const isRegistered = await Doctor.findOne({ email });
    if (isRegistered) {
      return next(new ErrorHandler("Doctor con este email ya existe"));
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
    const licenseCloudinaryResponse = await cloudinary.uploader.upload(
      licencia.tempFilePath
    );

    if (!licenseCloudinaryResponse || licenseCloudinaryResponse.error) {
      console.error(
        "Error cloudinary:",
        licenseCloudinaryResponse.error || "Error desconocido cloudinary"
      );
      return next(
        new ErrorHandler(
          "Fallo al subir el documento de ID del paciente a cloudinary",
          500
        )
      );
    }

    const doctor = await Doctor.create({
      nombre,
      apellido_pat,
      apellido_mat,
      photo: {
        public_id: photoCloudinaryResponse.public_id,
        url: photoCloudinaryResponse.secure_url,
      },
      especialidad,
      telefono,
      email,
      password,
      numero_licencia,
      licencia: {
        public_id: licenseCloudinaryResponse.public_id,
        url: licenseCloudinaryResponse.secure_url,
      },
      patientHistory,
    });
    res.status(200).json({
      succes: true,
      message: "DOCTOR creado correctamente by Admin!!",
    });
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

export const getAdminDetails = async (req, res, next) => {
  try {
    //Req.user proveniente del middleware de autenticacion previamante para pasar a esta ruta en el router del admin
    const admin = req.user;
    console.log(admin.id);

    //Verificamos con la coleccion Admin en la tabla de datos
    const verifyAdmin = await Admin.findById(req.user.id);

    //Si no lo encuentra
    if (!verifyAdmin) {
      return next(new ErrorHandler("Admin no encontrado", 404));
    }

    //Si lo encuentra
    res.status(200).json({
      success: true,
      details: [verifyAdmin.nombre, verifyAdmin.email, verifyAdmin.role],
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  res
    .status(200)
    .cookie("adminToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      succes: true,
      message: "Sesion de admin cerrada correctamente!!",
    });
};
