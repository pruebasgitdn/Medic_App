//Clase para
class ErrorHandler extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Error Interno del Servidor";
  err.status = err.status || 500; //code internal server_Error

  if (err.code === 11000) {
    //11000 codigo mongoDB para indicar  error de duplicado

    //Extraer claves del err.keyValue que => es un objeto de mondoDb cuando ocurre un error de duplicado
    const message = `Duplicado ${Object.keys(err.keyValue)} ingresado`;

    //Y de acuerdo al mensaje de error mas codigo de error creamos el manejo de error
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "JsonWebTokenError") {
    //Problema con el token como invalido o mal formado
    const message = `Json Web Token es invalido, intenta de nuevo!`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "TokenExpiredError") {
    //Ocurre cuando el token ha expirado
    const message = `Json Web Token ha caducado, intenta de nuevo!`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "CastError") {
    //Mongoose conversion de dato fallido

    //err.path(mongoose) suele indicar el nombre del campo que causó el problema al intentar convertir un valor
    const message = `Invalido en: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  //Si err.errors existe(es decir, si hay errorres), se mapean y se obtienen los valores como error y seran iguales a error.message separados por ' ', si no existe, de lo contrario mostrar solo el mensaje
  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((error) => error.message)
        .join(". ")
    : err.message;

  return res.status(err.status).json({
    succes: false,
    message: errorMessage,
  });
};

export default ErrorHandler;
