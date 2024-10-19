import express from "express";
import {
  createAdmin,
  createDoctor,
  deleteAllMessages,
  deleteAppointment,
  deleteDoctor,
  deleteMessage,
  deletePatient,
  EditDoctorProfile,
  EditPatientProfile,
  EditProfile,
  getAdminDetails,
  getAllDoctors,
  getAllPatients,
  getAppointments,
  getMessages,
  login,
  logout,
} from "../controller/adminController.js";
import { verifyAdminToken } from "../middlewares/authMiddleware.js";
import {
  deleteSupportById,
  getDrSupports,
  getPatSupports,
  getSupports,
  respondSupport,
} from "../controller/supportController.js";
import { adminCancelAppointment } from "../controller/appointmentController.js";

const router = express.Router();

//router.metodo.('ruta',middleware,controller)
router.post("/createDoctor", verifyAdminToken, createDoctor);
router.post("/createAdmin", verifyAdminToken, createAdmin);
router.post("/login", login);
router.get("/getDoctors", verifyAdminToken, getAllDoctors);
router.get("/getPatients", verifyAdminToken, getAllPatients);
router.get("/me", verifyAdminToken, getAdminDetails);
router.put("/editprofile", verifyAdminToken, EditProfile);
router.put("/editdoctor/:id", verifyAdminToken, EditDoctorProfile);
router.put("/editpatient/:id", verifyAdminToken, EditPatientProfile);
router.delete("/deletedoctor/:id", verifyAdminToken, deleteDoctor);
router.delete("/deletepatient/:id", verifyAdminToken, deletePatient);
router.delete("/deleteappointment/:id", verifyAdminToken, deleteAppointment);
router.delete("/deletemessage/:id", verifyAdminToken, deleteMessage);
router.get("/appointments", verifyAdminToken, getAppointments);
router.get("/messages", verifyAdminToken, getMessages);
router.delete("/clearmessages", verifyAdminToken, deleteAllMessages);
router.get("/logout", verifyAdminToken, logout);
router.get("/supports", verifyAdminToken, getSupports);
router.get("/drsupports", verifyAdminToken, getDrSupports);
router.get("/patsupports", verifyAdminToken, getPatSupports);
router.post("/respondsupport/:id", verifyAdminToken, respondSupport);
router.delete("/deletesupport/:id", verifyAdminToken, deleteSupportById);
router.put("/appointment/cancel/:id", verifyAdminToken, adminCancelAppointment);

export default router;
