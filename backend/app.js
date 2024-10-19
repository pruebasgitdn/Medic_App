import express from "express";
import { config } from "dotenv";
import cors from "cors"; //peticion a otros dominios
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbConnection } from "./database/dbConnection.js";
import messageRouter from "./router/messageRouter.js";
import patientRouter from "./router/patientRouter.js";
import adminRouter from "./router/adminRouter.js";
import doctorRouter from "./router/doctorRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

const app = express(); //iniciar app

//Config(configura las variables de entornto env)
config({ path: "./config/config.env" });

//MIDDLEWARES
app.use(
  cors({
    origin: [process.env.FRONTEND_URI, process.env.DASHBOARD_URI], //dominios que tienen acceso al API
    methods: ["PUT", "DELETE", "POST", "GET"], //metodos http
    credentials: true,
  })
);

app.use(cookieParser()); //Manejo de cookies (req.cookies =>etc)
app.use(express.json()); //Manejo de solicitudes JSON
app.use(express.urlencoded({ extended: true })); //Manejo de datos HTML(Forms)

app.use(
  fileUpload({
    useTempFiles: true, //archivos temporales
  })
);

//Enrutadores con su ruta base
app.use("/api/message", messageRouter);
app.use("/api/patient", patientRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/appointment", appointmentRouter);

//Conexion a la bd
dbConnection();
app.use(errorMiddleware); //middleware Errores manejo
export default app;
