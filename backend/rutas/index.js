const express = require('express');
const router = express.Router();

// Importar rutas específicas
const videoRutas = require('./videoRutas');
const likeRutas = require('./likeRutas');
const comentarioRutas = require('./comentarioRutas');

// Configurar rutas
router.use('/videos', videoRutas);
router.use('/likes', likeRutas);
router.use('/comentarios', comentarioRutas);

// Ruta principal para verificar que la API está funcionando
router.get('/', (req, res) => {
  res.json({
    mensaje: 'API de videos funcionando correctamente',
    version: '1.0.0'
  });
});

module.exports = router;