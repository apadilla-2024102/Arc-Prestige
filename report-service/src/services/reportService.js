const axios = require('axios');

class ReportService {
    // Obtener alumnos inscritos
    static async getEnrolledStudents(token) {
        try {
            const response = await axios.get(
                `${process.env.INSCRIPTION_SERVICE_URL}/api/inscriptions`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch enrolled students');
        }
    }

    // Obtener asistencia por periodo
    static async getAttendanceReport(token, classId = null) {
        try {
            const url = classId
                ? `${process.env.ATTENDANCE_SERVICE_URL}/api/attendance/class/${classId}`
                : `${process.env.ATTENDANCE_SERVICE_URL}/api/attendance`;

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch attendance report');
        }
    }

    // Obtener clases y estadísticas
    static async getClassStatistics(token) {
        try {
            const response = await axios.get(
                `${process.env.CLASS_SERVICE_URL}/api/classes`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            return response.data.map(cls => ({
                id: cls._id,
                name: cls.name,
                level: cls.level,
                totalEnrolled: cls.currentEnrollment,
                capacity: cls.maxCapacity,
                occupancyRate: ((cls.currentEnrollment / cls.maxCapacity) * 100).toFixed(2) + '%',
                status: cls.status,
            }));
        } catch (error) {
            throw new Error('Failed to fetch class statistics');
        }
    }

    // Obtener participantes por clase
    static async getParticipantsByClass(token, classId) {
        try {
            const response = await axios.get(
                `${process.env.CLASS_SERVICE_URL}/api/classes/${classId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            return {
                classId: response.data._id,
                className: response.data.name,
                participants: response.data.participants,
                totalParticipants: response.data.currentEnrollment,
            };
        } catch (error) {
            throw new Error('Failed to fetch participants');
        }
    }

    // Calcular estadísticas de asistencia para un alumno
    static async getStudentAttendanceStats(token, studentId) {
        try {
            const response = await axios.get(
                `${process.env.ATTENDANCE_SERVICE_URL}/api/attendance/student/${studentId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const attendance = response.data;
            const present = attendance.filter(a => a.status === 'present').length;
            const absent = attendance.filter(a => a.status === 'absent').length;
            const late = attendance.filter(a => a.status === 'late').length;
            const excused = attendance.filter(a => a.status === 'excused').length;

            return {
                studentId,
                totalRecords: attendance.length,
                present,
                absent,
                late,
                excused,
                attendanceRate: attendance.length > 0 ? ((present / attendance.length) * 100).toFixed(2) + '%' : 'N/A',
            };
        } catch (error) {
            throw new Error('Failed to calculate student attendance stats');
        }
    }
}

module.exports = ReportService;
