import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: [3, "El nombre debe tener al menos 3 caracteres"],
  },
  lastName: {
    type: String,
    required: true,
    minLength: [3, "El apellido debe tener al menos 3 caracteres"],
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Porfavor, proporciona un email valido"],
  },
  phone: {
    type: String,
    required: true,
    minLength: [
      10,
      "El numero de telefono debe contener exactamente 11 digitos",
    ],
  },
  message: {
    type: String,
    required: true,
    minLength: [10, "El mensaje debe contener al menos 10 caracteres"],
  },
});

export const Message = mongoose.model("Message", messageSchema);
