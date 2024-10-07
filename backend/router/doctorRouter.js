import express from "express";
import {
  EditProfile,
  getPatients,
  login,
  logout,
  Me,
} from "../controller/doctorController.js";
import {
  getDoctorAppointments,
  updateStatus,
} from "../controller/appointmentController.js";
import { verifyDoctorToken } from "../middlewares/authMiddleware.js";

const router = express.Router(); //Creando enrutador
router.post("/login", login); //Ruta, middleware y manejador
router.get("/logout", verifyDoctorToken, logout);
router.get("/appointments", verifyDoctorToken, getDoctorAppointments);
router.get("/me", verifyDoctorToken, Me);
router.put("/editprofile", verifyDoctorToken, EditProfile);
router.get("/getpatients", verifyDoctorToken, getPatients);
router.put("/update/:id", verifyDoctorToken, updateStatus);

export default router;
