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

            const inscription = new Inscription({
                ...value,
                studentId: req.userId,
            });

            await inscription.save();
            res.status(201).json(inscription);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Obtener todas las inscripciones
    static async getAll(req, res) {
        try {
            const inscriptions = await Inscription.find();
            res.json(inscriptions);
        } catch (err) {
            res.status(500).json({ error: err.message });
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
