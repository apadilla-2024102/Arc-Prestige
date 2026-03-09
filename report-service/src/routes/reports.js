const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/reportController');

// Reporte de alumnos inscritos
router.get('/enrolled-students', ReportController.getEnrolledStudentsReport);

// Reporte de asistencia
router.get('/attendance', ReportController.getAttendanceReport);

// Estadísticas de clases
router.get('/class-statistics', ReportController.getClassStatistics);

// Participantes por clase
router.get('/participants/:classId', ReportController.getParticipantsByClass);

// Estadísticas de asistencia de un alumno
router.get('/student-attendance/:studentId', ReportController.getStudentAttendanceStats);

module.exports = router;
