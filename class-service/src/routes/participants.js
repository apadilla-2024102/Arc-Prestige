const express = require('express');
const router = express.Router();

// Rutas para gestionar participantes
router.get('/', (req, res) => {
    // Obtener todos los participantes
    res.json([]);
});

module.exports = router;
