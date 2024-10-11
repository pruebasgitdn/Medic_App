import mongoose from "mongoose";

const soporteSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "tipoUsuario",
    },
    tipoUsuario: {
      type: String,
      required: true,
      enum: ["Doctor", "Paciente"],
    },
    file: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    asunto: {
      type: String,
      required: true,
      minLength: [5, "El motivo debe tener al menos 5 caracteres"],
    },
    description: {
      type: String,
      required: true,
      minLength: [8, "La descripción debe tener al menos 8 caracteres"],
    },
    estado: {
      type: String,
      enum: ["PENDIENTE", "RESUELTO"],
      default: "PENDIENTE",
    },
    respuestaAdmin: {
      type: String,
      minLength: [8, "La respuesta debe tener al menos 8 caracteres"],
    },
  },
  {
    timestamps: true,
  }
);

export const Support = mongoose.model("Support", soporteSchema);
