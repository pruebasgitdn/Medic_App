import express from "express";
import { createAppointment } from "../controller/appointmentController.js";
import { verifyPatientToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/post", verifyPatientToken, createAppointment);

export default router;
