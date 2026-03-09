const Class = require('../models/class');
const { validateClass } = require('../validators/classValidator');

class ClassController {
    // Crear clase
    static async create(req, res) {
        try {
            const { error, value } = validateClass(req.body);

            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const newClass = new Class({
                ...value,
                instructorId: req.userId,
                status: value.maxCapacity > 0 ? 'active' : 'full',
            });

            await newClass.save();
            res.status(201).json(newClass);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Obtener todas las clases
    static async getAll(req, res) {
        try {
            const classes = await Class.find();
            res.json(classes);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Obtener clase por ID
    static async getById(req, res) {
        try {
            const classItem = await Class.findById(req.params.id);

            if (!classItem) {
                return res.status(404).json({ error: 'Class not found' });
            }

            res.json(classItem);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Actualizar clase
    static async update(req, res) {
        try {
            const { error, value } = validateClass(req.body);

            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const classItem = await Class.findByIdAndUpdate(
                req.params.id,
                { ...value, updatedAt: new Date() },
                { new: true, runValidators: true }
            );

            if (!classItem) {
                return res.status(404).json({ error: 'Class not found' });
            }

            res.json(classItem);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Eliminar clase
    static async delete(req, res) {
        try {
            const classItem = await Class.findByIdAndDelete(req.params.id);

            if (!classItem) {
                return res.status(404).json({ error: 'Class not found' });
            }

            res.json({ message: 'Class deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Asignar alumno a clase
    static async assignStudent(req, res) {
        try {
            const { studentId, studentName } = req.body;
            const classItem = await Class.findById(req.params.id);

            if (!classItem) {
                return res.status(404).json({ error: 'Class not found' });
            }

            if (classItem.currentEnrollment >= classItem.maxCapacity) {
                return res.status(400).json({ error: 'Class is full' });
            }

            const participant = {
                studentId,
                studentName,
                status: 'active',
            };

            classItem.participants.push(participant);
            classItem.currentEnrollment += 1;

            if (classItem.currentEnrollment >= classItem.maxCapacity) {
                classItem.status = 'full';
            }

            await classItem.save();
            res.json(classItem);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Aprobar alumno
    static async approveStudent(req, res) {
        try {
            const { participantId } = req.body;
            const classItem = await Class.findById(req.params.id);

            if (!classItem) {
                return res.status(404).json({ error: 'Class not found' });
            }

            const participant = classItem.participants.find(p => p.studentId === participantId);
            if (participant) {
                participant.status = 'active';
            }

            await classItem.save();
            res.json(classItem);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Rechazar alumno
    static async rejectStudent(req, res) {
        try {
            const { participantId } = req.body;
            const classItem = await Class.findById(req.params.id);

            if (!classItem) {
                return res.status(404).json({ error: 'Class not found' });
            }

            classItem.participants = classItem.participants.filter(p => p.studentId !== participantId);
            classItem.currentEnrollment = Math.max(0, classItem.currentEnrollment - 1);
            classItem.status = classItem.currentEnrollment >= classItem.maxCapacity ? 'full' : 'active';

            await classItem.save();
            res.json(classItem);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = ClassController;
