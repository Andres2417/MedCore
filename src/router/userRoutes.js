import express from "express";
import multer from "multer";
import { uploadUsers, getAllUsers } from "../controllers/UserController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Rutas
router.post("/upload-users", upload.single("file"), uploadUsers);
router.get("/all", getAllUsers);

export default router;
