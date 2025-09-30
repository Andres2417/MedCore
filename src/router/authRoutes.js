const authController = require("../controllers/AuthController");
const express = require("express");
const router = express.Router();
//crear rutas para signin y signup
// http://localhost:3002/api/v1/auth/sign-up
router.post("/sign-up", authController.signup);
router.post("/verify-email", authController.verifyEmail);
router.post("/resend-verification", authController.resendVerificationCode)
router.post("/sign-in", authController.signin)

module.exports= router;
