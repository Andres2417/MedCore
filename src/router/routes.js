const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
//http://localhost:3002/api/v1/
router.use("/auth",authRoutes);
router.use("/user",userRoutes);

module.exports = router;