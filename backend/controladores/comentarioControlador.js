const { comentarioService } = require('../servicios');

// Controlador para manejar las operaciones de comentarios
const comentarioControlador = {
  // Crear un nuevo comentario
  crearComentario: async (req, res, next) => {
    try {
      const { videoId, deviceId, text } = req.body;
      
      // Validar datos
      if (!videoId || !deviceId || !text) {
        return res.status(400).json({
          error: 'El ID del video, el ID del dispositivo y el texto son obligatorios.'
        });
      }
      
      // Validar longitud del comentario
      if (text.trim().length < 1 || text.trim().length > 500) {
        return res.status(400).json({
          error: 'El comentario debe tener entre 1 y 500 caracteres.'
        });
      }
      
      // Crear comentario usando el servicio
      const comentario = await comentarioService.crearComentario(videoId, deviceId, text);
      
      return res.status(201).json({
        mensaje: 'Comentario creado con éxito',
        comentario
      });
    } catch (error) {
      next(error);
    }
  },
  
  // Obtener comentarios de un video
  obtenerComentariosPorVideo: async (req, res, next) => {
    try {
      const { videoId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      
      // Validar datos
      if (!videoId) {
        return res.status(400).json({
          error: 'El ID del video es obligatorio.'
        });
      }
      
      // Obtener comentarios usando el servicio
      const resultado = await comentarioService.obtenerComentariosPorVideo(videoId, page, limit);
      
      return res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  },
  
  // Eliminar un comentario
  eliminarComentario: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { deviceId } = req.body;
      
      // Validar datos
      if (!id || !deviceId) {
        return res.status(400).json({
          error: 'El ID del comentario y el ID del dispositivo son obligatorios.'
        });
      }
      
      // Eliminar comentario usando el servicio
      const resultado = await comentarioService.eliminarComentario(id, deviceId);
      
      return res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  },
  
  // Obtener un comentario específico por ID
  obtenerComentarioPorId: async (req, res, next) => {
    try {
      const { id } = req.params;
      
      // Validar datos
      if (!id) {
        return res.status(400).json({
          error: 'El ID del comentario es obligatorio.'
        });
      }
      
      // Obtener comentario usando el servicio
      const comentario = await comentarioService.obtenerComentarioPorId(id);
      
      return res.status(200).json({
        comentario
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = comentarioControlador;