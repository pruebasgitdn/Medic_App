import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Support } from "../models/supportSchema.js";
import { Doctor } from "../models/doctorSchema.js";
import { Patient } from "../models/patientSchema.js";
import cloudinary from "cloudinary";

// Crear soporte desde paciente
export const createSupport = async (req, res, next) => {
  try {
    const { asunto, description } = req.body;
    const { file } = req.files || {};

    if (!asunto || !description) {
      return next(
        new ErrorHandler("Por favor, llena todos los campos obligatorios.", 400)
      );
    }

    const patient = await Patient.findById(req.user.id);
    if (!patient) {
      return next(new ErrorHandler("Paciente no encontrado.", 404));
    }

    //si la hay
    let fileData = null;
    if (file) {
      const uploadResult = await cloudinary.uploader.upload(file.tempFilePath);
      if (!uploadResult || uploadResult.error) {
        return next(new ErrorHandler("Error al subir archivo", 500));
      }
      fileData = {
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url,
      };
    }

    const support = await Support.create({
      usuario: patient._id,
      tipoUsuario: "Paciente",
      file: fileData,
      asunto,
      description,
      estado: "PENDIENTE",
    });

    res.status(201).json({
      success: true,
      message: "Soporte creado exitosamente por el paciente.",
      support,
    });
  } catch (error) {
    next(error);
  }
};

// Crear soporte desde doctor
export const DocCreateSupport = async (req, res, next) => {
  try {
    const { asunto, description } = req.body;
    const { file } = req.files || {};

    if (!asunto || !description) {
      return next(
        new ErrorHandler("Por favor, llena todos los campos obligatorios.", 400)
      );
    }

    const doctor = await Doctor.findById(req.user.id);
    if (!doctor) {
      return next(new ErrorHandler("Doctor no encontrado.", 404));
    }

    //si la hay
    let fileData = null;
    if (file) {
      const uploadResult = await cloudinary.uploader.upload(file.tempFilePath);
      if (!uploadResult || uploadResult.error) {
        return next(new ErrorHandler("Error al subir archivo", 500));
      }
      fileData = {
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url,
      };
    }

    const support = await Support.create({
      usuario: doctor._id,
      tipoUsuario: "Doctor",
      file: fileData,
      asunto,
      description,
      estado: "PENDIENTE",
    });

    res.status(201).json({
      success: true,
      message: "Soporte creado exitosamente por el DR.",
      support,
    });
  } catch (error) {
    next(error);
  }
};

// Obtener todos los soportes (para admin)
export const getSupports = async (req, res, next) => {
  try {
    const supports = await Support.find().populate("usuario", "nombre email");

    if (!supports || supports.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron registros de soporte.",
      });
    }

    res.status(200).json({
      success: true,
      supports,
    });
  } catch (error) {
    next(error);
  }
};

// Obtener soportes de doctores
export const getDrSupports = async (req, res, next) => {
  try {
    const supports = await Support.find({ tipoUsuario: "Doctor" }).populate(
      "usuario",
      "nombre email numero_licencia"
    );

    if (!supports || supports.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron registros de soporte para Dr.",
      });
    }

    res.status(200).json({
      success: true,
      supports,
    });
  } catch (error) {
    next(error);
  }
};

// Obtener soportes de pacientes
export const getPatSupports = async (req, res, next) => {
  try {
    const supports = await Support.find({ tipoUsuario: "Paciente" }).populate(
      "usuario",
      "nombre email identificacion_numero"
    );

    if (!supports || supports.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron registros de soporte para Paciente.",
      });
    }

    res.status(200).json({
      success: true,
      supports,
    });
  } catch (error) {
    next(error);
  }
};

export const respondSupport = async (req, res, next) => {
  const { id } = req.params;
  const { respuestaAdmin } = req.body;

  try {
    const support = await Support.findById(id);

    if (!respuestaAdmin) {
      return res
        .status(404)
        .json({ success: false, message: "Proporciona la respuesta." });
    }
    if (!support) {
      return res
        .status(404)
        .json({ success: false, message: "Ticket no encontrado." });
    }
    if (support.estado !== "PENDIENTE") {
      return res.status(400).json({
        success: false,
        message: "Solo se pueden resolver tickets pendientes.",
      });
    }

    support.estado = "RESUELTO";
    support.respuestaAdmin = respuestaAdmin;
    await support.save();

    return res.json({ success: true, message: "Ticket resuelto", support });
  } catch (error) {
    next(error);
  }
};

export const getPatientTickets = async (req, res, next) => {
  const patientId = req.user.id;
  const tickets = await Support.find({ usuario: patientId });

  if (!tickets || tickets.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No se encontraron tickets para este paciente.",
    });
  }

  return res.status(200).json({
    success: true,
    tickets,
  });
};
export const getDoctorTickets = async (req, res, next) => {
  const doctorId = req.user.id;
  const tickets = await Support.find({ usuario: doctorId });

  if (!tickets || tickets.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No se encontraron tickets para este Doctor.",
    });
  }

  return res.status(200).json({
    success: true,
    tickets,
  });
};

// Controlador para eliminar un soporte por ID
export const deleteSupportById = async (req, res, next) => {
  const { id } = req.params; //  ID de  de la URL

  try {
    const support = await Support.findByIdAndDelete(id);

    if (!support) {
      return res.status(404).json({
        success: false,
        message: "El soporte no fue encontrado.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Soporte eliminado correctamente.",
    });
  } catch (error) {
    next(error);
  }
};
