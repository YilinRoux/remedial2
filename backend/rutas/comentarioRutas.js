const express = require('express');
const router = express.Router();
const { comentarioControlador } = require('../controladores');

// Ruta para crear un nuevo comentario
router.post('/', comentarioControlador.crearComentario);

// Ruta para obtener comentarios de un video
router.get('/video/:videoId', comentarioControlador.obtenerComentariosPorVideo);

// Ruta para eliminar un comentario
router.delete('/:id', comentarioControlador.eliminarComentario);

// Ruta para obtener un comentario específico por ID
router.get('/:id', comentarioControlador.obtenerComentarioPorId);

module.exports = router;