//Controlador del esquema message
import { Message } from "../models/messageSchema.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
/*
req => contenido de la solictud urls, forms
        req.params => url parametros dinamicos /users/:id
        req.body => datos desde un form POST
        req.query => url data by GET
res => respuesta
next => pasar el sgte middleware
*/
export const sendMessage = async (req, res, next) => {
  //Coge valores
  const { firstName, lastName, email, phone, message } = req.body;

  try {
    //Si no los encuentra
    if (!firstName || !lastName || !email || !phone || !message) {
      return next(new ErrorHandler("Porfavor llena el form completo", 400));
    }

    //Si los encuentra
    await Message.create({ firstName, lastName, email, phone, message });
    res.status(200).json({
      succes: true,
      message: "Mensaje enviado satisfactoriamente!",
    });
  } catch (error) {
    next(error);
  }
};
