const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadUsers } = require("../controllers/UserController");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload-users", upload.single("file"), uploadUsers);
router.get("/all", require("../controllers/UserController").getAllUsers);

module.exports = router;
