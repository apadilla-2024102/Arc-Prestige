const Inscription = require('../models/inscription');
const { validateInscription } = require('../validators/inscriptionValidator');

class InscriptionController {
    // Crear inscripción
    static async create(req, res) {
        try {
            const { error, value } = validateInscription(req.body);

            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            try {
                const inscription = new Inscription({
                    ...value,
                    // Allow admin to pass a specific studentId (created user), otherwise use requester
                    studentId: value.studentId || req.userId,
                });

                await inscription.save();
                return res.status(201).json(inscription);
            } catch (dbErr) {
                console.warn('inscription save failed, using demo storage:', dbErr.message);
                const demoStorage = require('../utils/demoStorage');
                const { v4: uuidv4 } = require('uuid');
                const demo = { _id: uuidv4(), ...value, studentId: value.studentId || req.userId, createdAt: new Date(), updatedAt: new Date() };
                await demoStorage.append('inscriptions.json', demo);
                return res.status(201).json(demo);
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Obtener todas las inscripciones
    static async getAll(req, res) {
        try {
            const inscriptions = await Inscription.find();
            return res.json(inscriptions);
        } catch (err) {
            console.warn('inscription getAll fallback to demo storage:', err.message);
            const demoStorage = require('../utils/demoStorage');
            const data = await demoStorage.load('inscriptions.json');
            return res.json(data);
        }
    }

    // Obtener inscripción por ID
    static async getById(req, res) {
        try {
            const inscription = await Inscription.findById(req.params.id);

            if (!inscription) {
                return res.status(404).json({ error: 'Inscription not found' });
            }

            res.json(inscription);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Actualizar inscripción
    static async update(req, res) {
        try {
            const { error, value } = validateInscription(req.body);

            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const inscription = await Inscription.findByIdAndUpdate(
                req.params.id,
                { ...value, updatedAt: new Date() },
                { new: true, runValidators: true }
            );

            if (!inscription) {
                return res.status(404).json({ error: 'Inscription not found' });
            }

            res.json(inscription);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Eliminar inscripción
    static async delete(req, res) {
        try {
            const inscription = await Inscription.findByIdAndDelete(req.params.id);

            if (!inscription) {
                return res.status(404).json({ error: 'Inscription not found' });
            }

            res.json({ message: 'Inscription deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Obtener inscripciones por estado
    static async getByStatus(req, res) {
        try {
            const { status } = req.params;
            const inscriptions = await Inscription.find({ status });
            res.json(inscriptions);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = InscriptionController;
