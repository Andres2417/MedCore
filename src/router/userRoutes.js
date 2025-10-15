import express from "express";
import multer from "multer";
import { uploadUsers, getAllUsers } from "../controllers/UserController.js";

const router = express.Router();
const storage = process.env.VERCEL
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: 'uploads/',
      filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
    });

const upload = multer({ storage });


// Rutas
router.post("/upload-users", upload.single("file"), uploadUsers);
router.get("/all", getAllUsers);

export default router;
