import jwt from "jsonwebtoken";
import ErrorHandler from "./errorMiddleware.js";

export const verifyToken = (req, res, next) => {
  //Extraemos cookies (previamente generadas si se inicio sesion o creo nuevo user)
  const token =
    req.cookies.adminToken ||
    req.cookies.patientToken ||
    req.cookies.doctorToken ||
    req.headers["authorization"];

  if (!token) {
    return next(
      new ErrorHandler("No se proporciona el token, autorizacion denegada", 403)
    );
  }

  try {
    /*
    decoded informacion desencriptada del token 
    req.user => en las sgtes partes de la ruta se tenga acceso a la información del usuario autenticado
    */
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded Token:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    return next(new ErrorHandler("Token Invalido", 401));
  }
};

export const verifyPatientToken = (req, res, next) => {
  //Extraemos cookies (previamente generadas si se inicio sesion o creo nuevo user)
  const token = req.cookies.patientToken;

  if (!token) {
    return next(
      new ErrorHandler(
        "No se proporciona el token del paciente, autorizacion denegada.",
        403
      )
    );
  }

  try {
    //verificamos y desencriptamos el token en decoded para ser pasado a req.user que lo pasa al controlador
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded patient Token:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    return next(new ErrorHandler("Token del Paciente invalido.", 401));
  }
};

export const verifyAdminToken = (req, res, next) => {
  //Extraemos cookies (previamente generadas si se inicio sesion o creo nuevo user)
  const token = req.cookies.adminToken;

  if (!token) {
    return next(
      new ErrorHandler(
        "No se proporciona el token del admin, autorizacion denegada.",
        403
      )
    );
  }

  try {
    //verificamos y desencriptamos el token en decoded para ser pasado a req.user que lo pasa al controlador
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded admin Token:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    return next(new ErrorHandler("Token del Admin invalido.", 401));
  }
};

export const verifyDoctorToken = (req, res, next) => {
  //Extraemos cookies (previamente generadas si se inicio sesion o creo nuevo user)
  const token = req.cookies.doctorToken;

  if (!token) {
    return next(
      new ErrorHandler(
        "No se proporciona el token del doctor, autorizacion denegada.",
        403
      )
    );
  }

  try {
    //verificamos y desencriptamos el token en decoded para ser pasado a req.user que lo pasa al controlador
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded doctor Token:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    return next(new ErrorHandler("Token del Doctor invalido.", 401));
  }
};
