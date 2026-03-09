const express = require('express');
const router = express.Router();
const ClassController = require('../controllers/classController');

// Crear clase
router.post('/', ClassController.create);

// Obtener todas las clases
router.get('/', ClassController.getAll);

// Obtener clase por ID
router.get('/:id', ClassController.getById);

// Actualizar clase
router.put('/:id', ClassController.update);

// Eliminar clase
router.delete('/:id', ClassController.delete);

// Asignar alumno a clase
router.post('/:id/assign-student', ClassController.assignStudent);

// Aprobar alumno
router.post('/:id/approve-student', ClassController.approveStudent);

// Rechazar alumno
router.post('/:id/reject-student', ClassController.rejectStudent);

module.exports = router;
