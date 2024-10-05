import express from "express";
import {
  cancelAppointment,
  createAppointment,
  respondAppointment,
} from "../controller/appointmentController.js";
import {
  verifyDoctorToken,
  verifyPatientToken,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/post", verifyPatientToken, createAppointment);
router.put("/cancel/:id", verifyPatientToken, cancelAppointment);
router.post("/respond/:id", verifyDoctorToken, respondAppointment);

export default router;
