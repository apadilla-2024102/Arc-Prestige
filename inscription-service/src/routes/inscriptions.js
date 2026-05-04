const express = require('express');
const router = express.Router();
const InscriptionController = require('../controllers/inscriptionController');

// Crear inscripción
router.post('/', InscriptionController.create);

// Obtener todas las inscripciones
router.get('/', InscriptionController.getAll);

// Obtener inscripción por ID
router.get('/:id', InscriptionController.getById);

// Actualizar inscripción
router.put('/:id', InscriptionController.update);

// Eliminar inscripción
router.delete('/:id', InscriptionController.delete);

// Obtener por estado
router.get('/status/:status', InscriptionController.getByStatus);

module.exports = router;
