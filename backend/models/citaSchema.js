import mongoose from "mongoose";

const citaSchema = new mongoose.Schema({
  idDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  idPaciente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Paciente",
    required: true,
  },
  fecha: {
    type: Date,
    required: true,
  },
  hora: {
    type: String,
    required: true,
  },
  motivo: {
    type: String,
    required: true,
    minLength: [10, "El motivo de la cita debe tener al menos 10 caracteres"],
  },
  estado: {
    type: String,
    enum: ["PENDIENTE", "REALIZADA", "CANCELADA"],
    default: "PENDIENTE",
  },
  detallesDiagnostico: {
    type: String,
  },
  recomendaciones: {
    type: String,
  },
});

export const Cita = mongoose.model("Cita", citaSchema);
