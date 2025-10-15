import express from "express";
import multer from "multer";
import { uploadUsers, getAllUsers } from "../controllers/UserController.js";

const router = express.Router();

function getMulterStorage() {
  // Vercel -> memoryStorage
  if (process.env.VERCEL) {
    return multer.memoryStorage();
  }

  // Entorno local -> diskStorage
  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) =>
      cb(null, Date.now() + "-" + file.originalname),
  });
}

const upload = multer({ storage: getMulterStorage() });

// Rutas
router.post("/upload-users", upload.single("file"), uploadUsers);
router.get("/all", getAllUsers);

export default router;
