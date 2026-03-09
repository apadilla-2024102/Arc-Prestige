const Attendance = require('../models/attendance');
const { validateAttendance } = require('../validators/attendanceValidator');

class AttendanceController {
    // Registrar asistencia
    static async create(req, res) {
        try {
            const { error, value } = validateAttendance(req.body);

            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const attendance = new Attendance(value);
            await attendance.save();
            res.status(201).json(attendance);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Obtener toda la asistencia
    static async getAll(req, res) {
        try {
            const attendance = await Attendance.find();
            res.json(attendance);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Obtener asistencia por ID
    static async getById(req, res) {
        try {
            const attendance = await Attendance.findById(req.params.id);

            if (!attendance) {
                return res.status(404).json({ error: 'Attendance record not found' });
            }

            res.json(attendance);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Obtener asistencia por alumno
    static async getByStudent(req, res) {
        try {
            const { studentId } = req.params;
            const attendance = await Attendance.find({ studentId });
            res.json(attendance);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Obtener asistencia por clase
    static async getByClass(req, res) {
        try {
            const { classId } = req.params;
            const attendance = await Attendance.find({ classId });
            res.json(attendance);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Actualizar asistencia
    static async update(req, res) {
        try {
            const { error, value } = validateAttendance(req.body);

            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const attendance = await Attendance.findByIdAndUpdate(
                req.params.id,
                { ...value, updatedAt: new Date() },
                { new: true, runValidators: true }
            );

            if (!attendance) {
                return res.status(404).json({ error: 'Attendance record not found' });
            }

            res.json(attendance);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Eliminar asistencia
    static async delete(req, res) {
        try {
            const attendance = await Attendance.findByIdAndDelete(req.params.id);

            if (!attendance) {
                return res.status(404).json({ error: 'Attendance record not found' });
            }

            res.json({ message: 'Attendance record deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = AttendanceController;
