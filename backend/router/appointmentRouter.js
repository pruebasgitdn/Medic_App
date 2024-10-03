import express from "express";
import {
  cancelAppointment,
  createAppointment,
} from "../controller/appointmentController.js";
import { verifyPatientToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/post", verifyPatientToken, createAppointment);

router.put("/cancel/:id", verifyPatientToken, cancelAppointment);

export default router;
