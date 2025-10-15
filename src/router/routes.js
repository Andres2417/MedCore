import express from 'express';

import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import patientRoutes from './patientRoutes.js';

const router = express.Router();

// http://localhost:3002/api/v1/patients
router.use("/patients", patientRoutes);

// http://localhost:3002/api/v1/auth
router.use("/auth", authRoutes);

// http://localhost:3002/api/v1/user
router.use("/user", userRoutes);

export default router;
