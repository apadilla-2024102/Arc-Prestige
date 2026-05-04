import ClassService from '../services/classService.js';

class ClassController {
    // Crear clase
    static async create(req, res) {
        try {
            const newClass = await ClassService.createClass(req.body, req.userId);
            res.status(201).json(newClass);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Obtener todas las clases
    static async getAll(req, res) {
        try {
            const classes = await ClassService.getAllClasses();
            res.json(classes);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Obtener clase por ID
    static async getById(req, res) {
        try {
            const classItem = await ClassService.getClassById(req.params.id);

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
            const classItem = await ClassService.updateClass(req.params.id, req.body);

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
            const classItem = await ClassService.deleteClass(req.params.id);

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
            const classItem = await ClassService.assignStudentToClass(req.params.id, studentId, studentName);
            res.json(classItem);
        } catch (err) {
            if (err.message === 'Class not found') {
                res.status(404).json({ error: err.message });
            } else if (err.message === 'Class is full') {
                res.status(400).json({ error: err.message });
            } else {
                res.status(500).json({ error: err.message });
            }
        }
    }

    // Aprobar alumno
    static async approveStudent(req, res) {
        try {
            const { participantId } = req.body;
            const classItem = await ClassService.approveStudent(req.params.id, participantId);
            res.json(classItem);
        } catch (err) {
            if (err.message === 'Class not found') {
                res.status(404).json({ error: err.message });
            } else {
                res.status(500).json({ error: err.message });
            }
        }
    }

    // Rechazar alumno
    static async rejectStudent(req, res) {
        try {
            const { participantId } = req.body;
            const classItem = await ClassService.rejectStudent(req.params.id, participantId);
            res.json(classItem);
        } catch (err) {
            if (err.message === 'Class not found') {
                res.status(404).json({ error: err.message });
            } else {
                res.status(500).json({ error: err.message });
            }
        }
    }
}

export default ClassController;
