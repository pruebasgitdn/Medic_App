import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const doctorSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    minLength: [3, "El nombre debe tener al menos 3 caracteres"],
  },
  apellido_pat: {
    type: String,
    required: true,
    minLength: [3, "El apellido debe tener al menos 3 caracteres"],
  },
  apellido_mat: {
    type: String,
    minLength: [3, "El apellido debe tener al menos 3 caracteres"],
  },
  photo: {
    public_id: {
      type: String,
      required: [true, "Ingresa la foto."], 
    },
    url: {
      type: String,
      required: [true, "Ingresa la URL de la foto."], 
    },
  },
  especialidad: {
    type: String,
    required: true,
    minLength: [3, "La especialidad debe tener al menos 3 caracteres"],
  },
  telefono: {
    type: String,
    required: true,
    minLength: [10, "El número de teléfono debe contener al menos 10 dígitos"],
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Por favor, proporciona un email válido"],
  },
  password: {
    type: String,
    required: true,
    minLength: [8, "La contraseña debe tener al menos 8 caracteres"],
  },
  numero_licencia: {
    type: String,
    required: true,
    minLength: [5, "El número de licencia debe tener al menos 5 caracteres"],
  },
  licencia: {
    public_id: {
      type: String,
      required: [true, "Ingresa la licencia."], // Mensaje de error personalizado
    },
    url: {
      type: String,
      required: [true, "Ingresa la URL de la licencia."], // Mensaje de error personalizado
    },
  },
  patientHistory: [
    {
      patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Paciente",
      },
      citaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cita", // Relación con el esquema de Cita
      },
      patientName: {
        type: String,
      },
      motivo: {
        type: String,
        minLength: [10, "El motivo debe contener al menos 10 caracteres"],
      },
      diagnostico: {
        type: String,
        minLength: [10, "El diagnóstico debe contener al menos 10 caracteres"],
      },
      recomendaciones: {
        type: String,
        minLength: [
          10,
          "Las recomendaciones deben contener al menos 10 caracteres",
        ],
      },
    },
  ],
  role: {
    type: String,
    enum: {
      values: ["doctor"],
      message: "El único valor permitido es 'doctor'",
    },
    default: "doctor",
  },
});

//MIDDLEWARE PARA HASHEAR CONTRASEÑAS (PENDIENTE)
doctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//Comparar contraseñas hasheadas
doctorSchema.methods.comaprePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Generar JSONTOKEN
doctorSchema.methods.generateJWT = function () {
  //Firma el token con el _id del paciente
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

export const Doctor = mongoose.model("Doctor", doctorSchema);
