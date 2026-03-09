const ReportService = require('../services/reportService');

class ReportController {
    // Obtener reporte de alumnos inscritos
    static async getEnrolledStudentsReport(req, res) {
        try {
            const students = await ReportService.getEnrolledStudents(
                req.headers.authorization.split(' ')[1]
            );
            res.json({
                title: 'Reporte de Alumnos Inscritos',
                timestamp: new Date(),
                data: students,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Obtener reporte de asistencia
    static async getAttendanceReport(req, res) {
        try {
            const { classId } = req.query;
            const attendance = await ReportService.getAttendanceReport(
                req.headers.authorization.split(' ')[1],
                classId
            );
            res.json({
                title: 'Reporte de Asistencia',
                timestamp: new Date(),
                data: attendance,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Obtener estadísticas de clases
    static async getClassStatistics(req, res) {
        try {
            const stats = await ReportService.getClassStatistics(
                req.headers.authorization.split(' ')[1]
            );
            res.json({
                title: 'Estadísticas de Clases',
                timestamp: new Date(),
                data: stats,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Obtener participantes por clase
    static async getParticipantsByClass(req, res) {
        try {
            const { classId } = req.params;
            const participants = await ReportService.getParticipantsByClass(
                req.headers.authorization.split(' ')[1],
                classId
            );
            res.json({
                title: 'Participantes por Clase',
                timestamp: new Date(),
                data: participants,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Obtener estadísticas de asistencia de un alumno
    static async getStudentAttendanceStats(req, res) {
        try {
            const { studentId } = req.params;
            const stats = await ReportService.getStudentAttendanceStats(
                req.headers.authorization.split(' ')[1],
                studentId
            );
            res.json({
                title: 'Estadísticas de Asistencia del Alumno',
                timestamp: new Date(),
                data: stats,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ReportController;
