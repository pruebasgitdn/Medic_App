import { Message } from "../models/messageSchema.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Doctor } from "../models/doctorSchema.js";
import { Admin } from "../models/adminSchema.js";
import { Patient } from "../models/patientSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import { Cita } from "../models/citaSchema.js";
import cloudinary from "cloudinary";
import bcrypt from "bcrypt";

/* 
Iniciar Sesion
Cerrar Sesion
Crear Admin
EditarPerfil
EliminarUsuario
EliminarDoctor
EliminarCitas
Eliminar Cuenta (Propia)
*/

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Encontrar paciente por email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return next(new ErrorHandler("Admin no encontrado", 400));
    }

    //  Verificar Contraseña
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
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
  const { nombre, email, password } = req.body;

  try {
    const { photo } = req.files || {}; // Extraemos photo si existe

    // Formatos permitidos
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];

    // Validar campos requeridos (nombre, email, password)
    if (!nombre || !email || !password) {
      return next(
        new ErrorHandler(
          "Por favor, llena todos los campos del formulario",
          400
        )
      );
    }

    // Verificar si ya está registrado
    const isRegistered = await Admin.findOne({ email });
    if (isRegistered) {
      return next(new ErrorHandler("Administrador con este email ya existe"));
    }

    // Inicializamos el objeto para la photo con valores por defecto
    let photoData = null;

    // Si la photo existe, validar formato y subirla a Cloudinary
    if (photo) {
      if (!allowedFormats.includes(photo.mimetype)) {
        return next(new ErrorHandler("Formato de archivo no soportado!", 400));
      }

      // Subir la foto a Cloudinary
      const cloudinaryResponse = await cloudinary.uploader.upload(
        photo.tempFilePath
      );

      if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error(
          "Error en Cloudinary:",
          cloudinaryResponse.error || "Error desconocido en Cloudinary"
        );
        return next(
          new ErrorHandler("Fallo al subir la imagen a Cloudinary", 500)
        );
      }

      // Guardar datos de la photo si se subió correctamente
      photoData = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      };
    }

    // Crear el admin con la photo si existe, si no, simplemente sin la photo
    const admin = await Admin.create({
      nombre,
      email,
      password,
      ...(photoData && { photo: photoData }), // Solo incluir la photo si existe
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
    } = req.body; // Extraer valores

    const { photo, licencia } = req.files || {}; // Extraemos los archivos

    const allowedFormats = [
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/jpg",
    ]; // Formatos permitidos

    // Validaciones para los archivos licencia
    if (!licencia || !allowedFormats.includes(licencia.mimetype)) {
      return next(
        new ErrorHandler(
          !licencia
            ? "Licencia del doctor requerida!"
            : "Formato de archivo no soportado para la licencia!",
          400
        )
      );
    }

    // Validar campos requeridos
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
        new ErrorHandler("Por favor llena todos los campos del form!!", 400)
      );
    }

    // Verificar si está registrado
    const isRegistered = await Doctor.findOne({ email });
    if (isRegistered) {
      return next(new ErrorHandler("Doctor con este email ya existe"));
    }

    // Subir el archivo temporal de licencia a Cloudinary
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
          "Fallo al subir el documento de ID del paciente a Cloudinary",
          500
        )
      );
    }

    // Subir la foto si se proporcionó
    let photoData = null;
    if (photo) {
      if (!allowedFormats.includes(photo.mimetype)) {
        return next(
          new ErrorHandler("Formato de archivo no soportado para la foto!", 400)
        );
      }

      const photoCloudinaryResponse = await cloudinary.uploader.upload(
        photo.tempFilePath
      );

      if (!photoCloudinaryResponse || photoCloudinaryResponse.error) {
        console.error(
          "Error cloudinary:",
          photoCloudinaryResponse.error || "Error desconocido cloudinary"
        );
        return next(
          new ErrorHandler(
            "Fallo al subir la foto del doctor a Cloudinary",
            500
          )
        );
      }

      photoData = {
        public_id: photoCloudinaryResponse.public_id,
        url: photoCloudinaryResponse.secure_url,
      };
    }

    // Crear el doctor
    const doctor = await Doctor.create({
      nombre,
      apellido_pat,
      apellido_mat,
      photo: photoData, // Se puede guardar como null si no se proporcionó
      especialidad,
      telefono,
      email,
      password,
      numero_licencia,
      licencia: {
        public_id: licenseCloudinaryResponse.public_id,
        url: licenseCloudinaryResponse.secure_url,
      },
    });

    res.status(200).json({
      success: true,
      message: "DOCTOR creado correctamente por Admin!!",
      doctor,
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

export const getAllPatients = async (req, res, next) => {
  const patients = await Patient.find();
  res.status(200).json({
    success: true,
    patients,
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

export const EditProfile = async (req, res, next) => {
  try {
    const adminId = req.user.id; // ID del admin autenticado

    // Obtener los datos que el admin desea actualizar
    const { email, password } = req.body;

    const { photo } = req.files || {};

    // Buscar el paciente
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return next(new ErrorHandler("Paciente no encontrado", 404));
    }

    //Verificar por email usado
    if (email !== admin.email) {
      const emailExist = await Admin.findOne({ email });
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
      if (admin.photo.public_id) {
        //cloud.uploaded.destoy => metodo para eliminar, el .public_id => que es el id de la foto en cloudinaty
        await cloudinary.uploader.destroy(admin.photo.public_id);
      }

      admin.photo = {
        public_id: photoCloudinaryResponse.public_id,
        url: photoCloudinaryResponse.secure_url,
      };
    }

    // Actualizar los campos del admin
    admin.email = email || admin.email;
    admin.password = password || admin.password;

    // Guardar los cambios
    await admin.save();

    res.status(200).json({
      success: true,
      message: "Perfil actualizado correctamente",
      admin,
    });
  } catch (error) {
    next(error);
  }
};

export const EditDoctorProfile = async (req, res, next) => {
  try {
    const doctorId = req.params.id; //ID del doctor URL

    // Obtener los datos
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

    // Buscar al doctor por ID
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return next(new ErrorHandler("Doctor no encontrado", 404));
    }

    // Verificar si el email está en uso
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

      // Eliminar la foto anterior de Cloudinary
      if (doctor.photo && doctor.photo.public_id) {
        await cloudinary.uploader.destroy(doctor.photo.public_id);
      }

      doctor.photo = {
        public_id: photoCloudinaryResponse.public_id,
        url: photoCloudinaryResponse.secure_url,
      };
    }

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

    // Actualizar los campos del doctor
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
      message: "Doctor actualizado correctamente",
      doctor,
    });
  } catch (error) {
    next(error);
  }
};

export const EditPatientProfile = async (req, res, next) => {
  try {
    const patientId = req.params.id;

    const {
      nombre,
      apellido_pat,
      apellido_mat,
      telefono,
      email,
      direccion,
      genero,
    } = req.body;

    const { photo, document_id } = req.files || {};

    const patient = await Patient.findById(patientId);

    if (!patient) {
      return next(new ErrorHandler("Paciente no encontrado", 404));
    }

    //Verificar email
    if (email && email !== patient.email) {
      const emailExist = await Patient.findOne({ email });
      if (emailExist) {
        return next(
          new ErrorHandler("Email ya se encuentra en uso / registrado", 400)
        );
      }
    }

    //Manejar foto
    if (photo) {
      const photoCloudinaryResponse = await cloudinary.uploader.upload(
        photo.tempFilePath
      );

      if (!photoCloudinaryResponse || photoCloudinaryResponse.error) {
        return next(
          new ErrorHandler(
            "Error al subir la nueva foto del paciente a Cloudinary",
            500
          )
        );
      }

      // Eliminar la foto anterior de Cloudinary
      if (patient.photo && patient.photo.public_id) {
        await cloudinary.uploader.destroy(patient.photo.public_id);
      }

      patient.photo = {
        public_id: photoCloudinaryResponse.public_id,
        url: photoCloudinaryResponse.secure_url,
      };
    }

    //Manejar docmuento
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

    //Actualizar campos del paciente

    patient.nombre = nombre || patient.nombre;
    patient.apellido_pat = apellido_pat || patient.apellido_pat;
    patient.apellido_mat = apellido_mat || patient.apellido_mat;
    patient.email = email || patient.email;
    patient.telefono = telefono || patient.telefono;
    patient.direccion = direccion || patient.direccion;
    patient.genero = genero || patient.genero;

    //Guaradr cambios
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

export const deleteDoctor = async (req, res, next) => {
  try {
    const doctorId = req.params.id; //para URL

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return next(new ErrorHandler("Doctor no encontrado", 404));
    }

    // Eliminar la imagen de perfil del doctor en Cloudinary, si existe
    if (doctor.photo && doctor.photo.public_id) {
      try {
        await cloudinary.uploader.destroy(doctor.photo.public_id); // Eliminar la foto de Cloudinary
      } catch (error) {
        return next(
          new ErrorHandler(
            "Error al eliminar la foto del doctor en Cloudinary",
            500
          )
        );
      }
    }

    // Eliminar la licencia del doctor en Cloudinary, si existe
    if (doctor.licencia && doctor.licencia.public_id) {
      try {
        await cloudinary.uploader.destroy(doctor.licencia.public_id); // Eliminar la licencia de Cloudinary
      } catch (error) {
        return next(
          new ErrorHandler(
            "Error al eliminar la licencia del doctor en Cloudinary",
            500
          )
        );
      }
    }

    await Doctor.findByIdAndDelete(doctorId);

    res.status(200).json({
      succes: true,
      message: "Doctor eliminado correctamente",
    });
  } catch (error) {
    next(error);
  }
};

export const deletePatient = async (req, res, next) => {
  try {
    const patientId = req.params.id; //para URL

    const patient = await Patient.findById(patientId);

    if (!patient) {
      return next(new ErrorHandler("Doctor no encontrado", 404));
    }

    // Eliminar la imagen de perfil del doctor en Cloudinary, si existe
    if (patient.photo && patient.photo.public_id) {
      try {
        await cloudinary.uploader.destroy(patient.photo.public_id); // Eliminar la foto de Cloudinary
      } catch (error) {
        return next(
          new ErrorHandler(
            "Error al eliminar la foto del paciente en Cloudinary",
            500
          )
        );
      }
    }

    // Eliminar la licencia del doctor en Cloudinary, si existe
    if (patient.document_id && patient.document_id.public_id) {
      try {
        await cloudinary.uploader.destroy(patient.document_id.public_id); // Eliminar la licencia de Cloudinary
      } catch (error) {
        return next(
          new ErrorHandler(
            "Error al eliminar el documento del paciente en Cloudinary",
            500
          )
        );
      }
    }

    await Patient.findByIdAndDelete(patientId);

    res.status(200).json({
      succes: true,
      message: "Paciente eliminado correctamente",
    });
  } catch (error) {
    next(error);
  }
};

export const getAppointments = async (req, res, next) => {
  try {
    // Obtener todas las citas
    const citas = await Cita.find()
      .populate(
        "idDoctor",
        "email nombre photo apellido_pat apellido_mat especialidad numero_licencia"
      )
      .populate(
        "idPaciente",
        "email photo apellido_pat apellido_mat telefono direccion "
      ); // Esto obtiene todas las citas de la base de datos

    // Si no hay citas
    if (!citas || citas.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron citas.",
      });
    }

    // Respuesta con todas las citas encontradas
    res.status(200).json({
      success: true,
      citas,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAppointment = async (req, res, next) => {
  try {
    const { id } = req.params; //URL

    // Buscar y eliminar la cita por id
    const appointment = await Cita.findByIdAndDelete(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Cita no encontrada.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cita eliminada correctamente.",
    });
  } catch (error) {
    next(error);
    return res.status(500).json({
      success: false,
      message: "Error al eliminar la cita.",
      error: error.message,
    });
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find();

    // Si no hay mensjaes
    if (!messages || messages.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron mensajes.",
      });
    }

    // Respuesta con todas las mensjaes encontradas
    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params; //URL

    // Buscar y eliminar mensaje por id
    const mensaje = await Message.findByIdAndDelete(id);

    if (!mensaje) {
      return res.status(404).json({
        success: false,
        message: "Mensaje no encontrado.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Mensaje eliminado correctamente.",
    });
  } catch (error) {
    next(error);
    return res.status(500).json({
      success: false,
      message: "Error al eliminar el mensaje.",
      error: error.message,
    });
  }
};

export const deleteAllMessages = async (req, res, next) => {
  try {
    await Message.deleteMany({});

    return res.status(200).json({
      success: true,
      message: "Todos los mensajes se han vaciado correctamente",
    });
  } catch (error) {
    console.error("Error deleting all messages:", error);
    return res.status(500).json({
      success: false,
      message: "Fallo al eliminar los mensajes.",
      error: error.message,
    });
  }
};
