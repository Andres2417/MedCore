import express from "express";
import { uploadUsers, getAllUsers } from "../controllers/UserController.js";

const router = express.Router();

// Carga multer y su configuración solo cuando se usa, no al importar
async function createUploadMiddleware() {
  const multer = (await import("multer")).default;

  if (process.env.VERCEL) {
    return multer({ storage: multer.memoryStorage() });
  } else {
    return multer({
      storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, "uploads/"),
        filename: (req, file, cb) =>
          cb(null, Date.now() + "-" + file.originalname),
      }),
    });
  }
}

// Ruta de subida dinámica
router.post("/upload-users", async (req, res, next) => {
  const upload = await createUploadMiddleware();
  upload.single("file")(req, res, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    next();
  });
}, uploadUsers);

router.get("/all", getAllUsers);

export default router;
