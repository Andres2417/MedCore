const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const patientRoutes = require('./patientRoutes');
//http://localhost:3002/api/v1/patients
router.use("/patients", patientRoutes);
//http://localhost:3002/api/v1/auth
router.use("/auth",authRoutes);
//http://localhost:3002/api/v1/user
router.use("/user",userRoutes);

module.exports = router;