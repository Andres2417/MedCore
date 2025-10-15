const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadUsers, getAllUsers } = require("../controllers/UserController");

// Usamos solo almacenamiento en memoria (MemoryStorage) para evitar el error EROFS
// en el sistema de archivos de solo lectura de Vercel.
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload-users", upload.single("file"), uploadUsers);
router.get("/all", getAllUsers);

module.exports = router;