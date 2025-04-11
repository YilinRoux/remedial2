const express = require('express');
const router = express.Router();
const { likeControlador } = require('../controladores');

// Ruta para dar like a un video
router.post('/', likeControlador.darLike);

// Ruta para quitar like a un video
router.delete('/', likeControlador.quitarLike);

// Ruta para verificar si un dispositivo ya dio like a un video
router.get('/verificar/:videoId', likeControlador.verificarLike);

// Ruta para obtener todos los likes de un video
router.get('/video/:videoId', likeControlador.obtenerLikesPorVideo);

module.exports = router;