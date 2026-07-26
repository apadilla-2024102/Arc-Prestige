const mongoose = require('mongoose');
const Attendance = require('../models/attendance');
const { validateAttendance } = require('../validators/attendanceValidator');

class AttendanceController {
    static fallbackResponse(res, value, message = 'attendance fallback response') {
        const demoStorage = require('../utils/demoStorage');
        const { v4: uuidv4 } = require('uuid');
        const demo = { _id: uuidv4(), ...value, createdAt: new Date(), updatedAt: new Date() };
        return demoStorage.append('attendance.json', demo)
            .then(() => res.status(201).json(demo))
            .catch((err) => {
                console.error('attendance fallback storage failed:', err.message);
                res.status(500).json({ error: 'Attendance fallback storage failed' });
            });
    }

    // Registrar asistencia
    static async create(req, res) {
        try {
            const { error, value } = validateAttendance(req.body);

            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            if (mongoose.connection.readyState !== 1) {
                console.warn('attendance DB disconnected, using fallback storage');
                return await AttendanceController.fallbackResponse(res, value);
            }

            try {
                const attendance = new Attendance(value);
                await attendance.save();
                return res.status(201).json(attendance);
            } catch (dbErr) {
                console.warn('attendance save failed, using demo storage:', dbErr.message);
                return await AttendanceController.fallbackResponse(res, value);
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Obtener toda la asistencia
    static async getAll(req, res) {
        try {
            if (mongoose.connection.readyState !== 1) {
                console.warn('attendance DB disconnected, loading fallback storage');
                const demoStorage = require('../utils/demoStorage');
                const data = await demoStorage.load('attendance.json');
                return res.json(data);
            }
            try {
                const attendance = await Attendance.find();
                return res.json(attendance);
            } catch (dbErr) {
                console.warn('attendance fetch failed, using demo storage:', dbErr.message);
                const demoStorage = require('../utils/demoStorage');
                const data = await demoStorage.load('attendance.json');
                return res.json(data);
            }
        } catch (err) {
            console.error('attendance getAll error', err);
            try { console.error('mongoose state', require('mongoose').connection.readyState); } catch(e){}
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
