import express from "express";
import {
  AddAllergie,
  deleteAllergie,
  EditProfile,
  generateReport,
  getPatients,
  login,
  logout,
  Me,
} from "../controller/doctorController.js";
import {
  doctorCancelAppointment,
  getDoctorAppointments,
} from "../controller/appointmentController.js";
import { verifyDoctorToken } from "../middlewares/authMiddleware.js";
import {
  createSupport,
  deleteSupportById,
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
router.put("/newallergie/:id", verifyDoctorToken, AddAllergie);
router.put("/delleteallergie/:id/:index", verifyDoctorToken, deleteAllergie);
router.delete("/deletesupport/:id", verifyDoctorToken, deleteSupportById);
router.put(
  "/appointment/cancel/:id",
  verifyDoctorToken,
  doctorCancelAppointment
);

router.post("/generatepdf", verifyDoctorToken, generateReport);
export default router;
