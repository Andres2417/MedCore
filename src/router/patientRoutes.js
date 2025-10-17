import express from 'express';
import PatientController, {
  createPatient,
  getPatientById,
  updatePatient,
  updatePatientState,
  listPatients
} from '../controllers/PatientController.js';
import {
  validatePatientCreation,
  validatePatientUpdate
} from '../middlewares/patientValidation.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { uploadDiagnosticMultiple } from '../config/multer.js';
const router = express.Router();

// Rutas de pacientes
router.post('/', validatePatientCreation, createPatient); // Crear paciente
router.get('/:id', getPatientById); // Obtener paciente por ID
router.put('/:id', validatePatientUpdate, updatePatient); // Actualizar paciente
router.patch('/state/:id', updatePatientState); // Cambiar estado (activo/inactivo)
router.get('/', listPatients); // Listar pacientes (paginado)
router.post('/:patientId/diagnostics', verifyToken, uploadDiagnosticMultiple, PatientController.createDiagnostic); // Crear diagnóstico para un paciente

export default router;
