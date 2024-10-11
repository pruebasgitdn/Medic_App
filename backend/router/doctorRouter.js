import express from "express";
import {
  EditProfile,
  getPatients,
  login,
  logout,
  Me,
} from "../controller/doctorController.js";
import { getDoctorAppointments } from "../controller/appointmentController.js";
import { verifyDoctorToken } from "../middlewares/authMiddleware.js";
import {
  createSupport,
  DocCreateSupport,
  getDoctorTickets,
} from "../controller/supportController.js";

const router = express.Router(); //Creando enrutador
router.post("/login", login); //Ruta, middleware y manejador
router.get("/logout", verifyDoctorToken, logout);
router.get("/appointments", verifyDoctorToken, getDoctorAppointments);
router.get("/me", verifyDoctorToken, Me);
router.put("/editprofile", verifyDoctorToken, EditProfile);
router.get("/getpatients", verifyDoctorToken, getPatients);
router.post("/support", verifyDoctorToken, DocCreateSupport);
router.get("/mysupports", verifyDoctorToken, getDoctorTickets);
export default router;
