import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Doctor } from "../models/doctorSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

/* 
Iniciar Sesion
Cerrar Sesion
Crear Doctor => 
  Esta función crearía un nuevo registro de doctor en la base de datos, incluyendo la validación de la licencia/documento y la generación de una contraseña.
  Entradas: Datos del doctor (nombre, número de licencia, etc.).
  Salidas: Confirmación de la solicitud y se dara revision al registro en unos dias para el registro exitoso!!.


Actualizar Doctor => 
  Permitiría a los administradores o al mismo doctor actualizar su información, como sus credenciales o su historial de pacientes atendidos.

  Entradas: ID del doctor, datos actualizados.
  Salidas: Confirmación de la actualización o errores.

AñadirHistorialPaciente => 
  Esta función se encargaría de registrar que un doctor ha atendido a un paciente. Incluiría detalles del reporte y del caso.
  Entradas: ID del doctor, detalles del paciente (ID del paciente, nombre, reporte, detalles del caso).
  Salidas: Confirmación de la adición o errores.

getPatientHistory =>( historial de pacientes atendidos por un doctor)
  Descripción: Permitiría al doctor o al administrador ver el historial completo de los pacientes atendidos por ese doctor.
  Entradas: ID del doctor.
  Salidas: Lista de historiales de pacientes atendidos.





*/

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Encontrar paciente por email
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return next(new ErrorHandler("Doctor no encontrado", 400));
    }

    // // Verificar Contraseña
    // const isMatch = await bcrypt.compare(password, patient.password);

    // Verificar la contraseña sin encriptar
    if (password !== doctor.password) {
      return res.status(400).json({ message: "Credenciales incorrectas" });
    }
    generateToken(
      doctor,
      "Incio de Sesio Exitoso, credenciales melas",
      200,
      res
    );
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  res
    .status(200)
    .cookie("doctorToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      succes: true,
      message: "Sesion de doctor cerrada correctamente!!",
    });
};
