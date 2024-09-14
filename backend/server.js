import app from "./app.js";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  //Configutando el cloudinary con las credenciales
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//conectar app en el puerto 4000
app.listen(process.env.PORT, () => {
  console.log(`Servidor escuchando en puerto: ${process.env.PORT}`);
});
