import express from "express";
import { sendMessage } from "../controller/messageController.js";

const router = express.Router(); //Creando enrutador
router.post("/send", sendMessage); //Ruta y manejador
export default router;
