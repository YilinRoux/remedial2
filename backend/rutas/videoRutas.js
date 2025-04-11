const express = require('express');
const router = express.Router();
const { videoControlador } = require('../controladores');
const { validarArchivo, validarDuracion } = require('../middleware/validarVideo');

// Ruta para subir un nuevo video
router.post(
  '/subir',
  validarArchivo,
  validarDuracion,
  videoControlador.subirVideo
);

// Ruta para obtener todos los videos (feed)
router.get('/', videoControlador.obtenerVideos);

// Ruta para obtener un video específico por ID
router.get('/:id', videoControlador.obtenerVideoPorId);

// Ruta para eliminar un video
router.delete('/:id', videoControlador.eliminarVideo);

// Ruta para obtener videos de un dispositivo específico
router.get('/dispositivo/:deviceId', videoControlador.obtenerVideosPorDispositivo);

module.exports = router;