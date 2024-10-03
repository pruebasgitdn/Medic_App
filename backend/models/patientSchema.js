import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const patientSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    minLength: [3, "El nombre debe tener al menos 3 caracteres"],
  },
  dot: {
    type: Date,
    required: true,
  },
  apellido_pat: {
    type: String,
    required: true,
    minLength: [3, "El apellido debe tener al   menos 3 caracteres"],
  },
  apellido_mat: {
    type: String,
    minLength: [3, "El apellido debe tener al menos 3 caracteres"],
  },
  photo: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  document_id: {
    public_id: {
      type: String,
      required: [true, "Ingresa la foto."], // Mensaje de error personalizado
    },
    url: {
      type: String,
      required: [true, "Ingresa la URL de la foto."], // Mensaje de error personalizado
    },
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Porfavor, proporciona un email valido"],
  },
  password: {
    type: String,
    required: true,
    minLength: [8, "La contraseña debe tener al menos 8 caracteres"],
  },
  telefono: {
    type: String,
    required: true,
    minLength: [10, "El numero de telefono debe minimo 10 digitos"],
    maxLength: [
      13,
      "El numero de telefono debe contener exactamente 11 digitos",
    ],
  },
  genero: {
    type: String,
    required: true,
    enum: ["HOMBRE", "MUJER", "OTRO"],
    message: "El género debe ser HOMBRE, MUJER u OTRO",
  },
  direccion: {
    type: String,
    required: true,
    minLength: [8, "La dirección debe contener al menos 10 caracteres"],
  },
  nombre_contacto_emergencia: {
    type: String,
    required: true,
    minLength: [4, "El Nombre del contacto debe tener al menos 4 caracteres"],
  },
  numero_contacto_emergencia: {
    type: String,
    required: true,
    minLength: [10, "El numero de telefono debe minimo 10 digitos"],
    maxLength: [
      11,
      "El numero de telefono debe contener exactamente 11 digitos",
    ],
  },
  proovedor_seguros: {
    type: String,
    required: true,
    minLength: [3, "Inserta Proovedor (min.3 caracteres)"],
  },
  alergias: [
    {
      tipo: {
        type: String,

        minLength: [3, "El tipo de alergia debe tener al menos 3 caracteres"],
      },
      descripcion: {
        type: String,

        minLength: [
          10,
          "La descripción de la alergia debe tener al menos 10 caracteres",
        ],
      },
    },
  ],
  historial_medico: {
    type: String,
    minLength: [10, "El mensaje debe contener al menos 10 caracteres"],
  },
  reporte_historial: [
    {
      idDoctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor", // Referencia al modelo 'Doctor'
      },
      idCita: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cita", // Referencia al modelo 'Cita'
      },
      motivo: {
        type: String,
        minLength: [5, "El motivo debe tener al menos 5 caracteres"],
      },
      fecha: {
        type: String,
      },
      detallesDiagnostico: {
        type: String,
      },
    },
  ],

  identificacion_tipo: {
    type: String,
    required: true,
    enum: ["CC", "TI", "CE", "NIT", "RUT"],
    message:
      "El tipo de identificación debe ser uno de los siguientes: CC, TI, CE, NIT, RUT",
  },
  identificacion_numero: {
    type: String,
    minLength: [10, "El mensaje debe contener al menos 10 caracteres"],
  },
  identificacion_url: {
    type: String,
    minLength: [10, "El mensaje debe contener al menos 10 caracteres"],
  },
  role: {
    type: String,
    enum: {
      values: ["paciente"],
      message: "El único valor permitido es 'paciente'",
    },
    default: "paciente",
  },
});

//MIDDLEWARE PARA HASHEAR CONTRASEÑAS (PENDIENTE)
patientSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//Comparar contraseñas hasheadas
patientSchema.methods.comaprePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Generar JSONTOKEN
patientSchema.methods.generateJWT = function () {
  //Firma el token con el _id del paciente
  return jwt.sign(
    { id: this._id, nombre: this.nombre, email: this.email, role: this.role },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES,
    }
  );
};

export const Patient = mongoose.model("Paciente", patientSchema);
