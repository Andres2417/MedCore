import { Router } from "express";
import { createPatient, getPatients, uploadPatientsCsv } from "../controllers/patients.controller.js";
import upload from "../middlewares/upload.js"; // multer

const router = Router();

router.post("/", createPatient);
router.get("/", getPatients);
router.post("/upload", upload.single("file"), uploadPatientsCsv);

export default router;