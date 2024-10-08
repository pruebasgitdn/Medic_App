import express from "express";
import {
  createAdmin,
  createDoctor,
  EditProfile,
  getAdminDetails,
  getAllDoctors,
  getAllPatients,
  login,
  logout,
} from "../controller/adminController.js";
import {
  verifyAdminToken,
  verifyToken,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

//router.metodo.('ruta',middleware,controller)
router.post("/createDoctor", verifyAdminToken, createDoctor);
router.post("/createAdmin", verifyAdminToken, createAdmin);
router.post("/login", login);
router.get("/getDoctors", verifyAdminToken, getAllDoctors);
router.get("/getPatients", verifyAdminToken, getAllPatients);
router.get("/me", verifyAdminToken, getAdminDetails);
router.put("/editprofile", verifyAdminToken, EditProfile);
router.get("/logout", verifyAdminToken, logout);

export default router;
