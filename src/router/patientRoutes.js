const express = require('express');
const router = express.Router();
const {
  createPatient,
  getPatientById,
  updatePatient,
  updatePatientState,
  listPatients
} = require('../controllers/PatientController');
const {
  validatePatientCreation,
  validatePatientUpdate
} = require('../middlewares/patientValidation');

// Rutas de pacientes
router.post('/', validatePatientCreation, createPatient); // Crear paciente
router.get('/:id', getPatientById); // Obtener paciente por ID
router.put('/:id', validatePatientUpdate, updatePatient); // Actualizar paciente
router.patch('/state/:id', updatePatientState); // Cambiar estado (activo/inactivo)
router.get('/', listPatients); // Listar pacientes (paginado)

module.exports = router;
