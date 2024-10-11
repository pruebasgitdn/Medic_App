import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const adminSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    minLength: [3, "El nombre debe tener al menos 3 caracteres"],
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
  photo: {
    public_id: {
      type: String,
      required: [true, "Ingresa la foto."], // Mensaje de error personalizado
    },
    url: {
      type: String,
      required: [true, "Ingresa la URL de la foto."], // Mensaje de error personalizado
    },
  },
  role: {
    type: String,
    enum: {
      values: ["admin"],
      message: "El único valor permitido es 'admin'",
    },
    default: "admin",
  },
});

//MIDDLEWARE PARA HASHEAR CONTRASEÑAS (PENDIENTE)
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//Comparar contraseñas hasheadas
adminSchema.methods.comaprePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Generar JSONTOKEN
adminSchema.methods.generateJWT = function () {
  //Firma el token con el _id del paciente
  return jwt.sign(
    { id: this._id, nombre: this.nombre, email: this.email, role: this.role },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES,
    }
  );
};

export const Admin = mongoose.model("Admin", adminSchema);
