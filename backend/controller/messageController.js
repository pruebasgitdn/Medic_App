//Controlador del esquema message
import { Message } from "../models/messageSchema.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";

export const sendMessage = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;

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
