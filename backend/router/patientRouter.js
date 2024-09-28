import express from "express";
import {
  patientRegister,
  login,
  getAllDoctors,
  getPatientDetails,
  logout,
  getHistory,
  EditProfile,
} from "../controller/patientController.js";
import { verifyPatientToken } from "../middlewares/authMiddleware.js";
import {
  checkAppointments,
  createAppointment,
} from "../controller/appointmentController.js";

const router = express.Router(); //Creando enrutador

router.post("/register", patientRegister);
router.post("/login", login);
router.get("/getDoctors", verifyPatientToken, getAllDoctors);
router.get("/me", verifyPatientToken, getPatientDetails);
router.get("/logout", verifyPatientToken, logout);
router.get("/appointments", verifyPatientToken, checkAppointments);
router.get("/gethistory", verifyPatientToken, getHistory);
router.put("/editprofile", verifyPatientToken, EditProfile);

export default router;
