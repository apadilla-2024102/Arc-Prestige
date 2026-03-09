const express = require('express');
const router = express.Router();
const AttendanceController = require('../controllers/attendanceController');

// Registrar asistencia
router.post('/', AttendanceController.create);

// Obtener toda la asistencia
router.get('/', AttendanceController.getAll);

// Obtener asistencia por ID
router.get('/:id', AttendanceController.getById);

// Obtener asistencia por alumno
router.get('/student/:studentId', AttendanceController.getByStudent);

// Obtener asistencia por clase
router.get('/class/:classId', AttendanceController.getByClass);

// Actualizar asistencia
router.put('/:id', AttendanceController.update);

// Eliminar asistencia
router.delete('/:id', AttendanceController.delete);

module.exports = router;
