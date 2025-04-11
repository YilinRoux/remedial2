const { likeService } = require('../servicios');

// Controlador para manejar las operaciones de likes
const likeControlador = {
  // Dar like a un video
  darLike: async (req, res, next) => {
    try {
      const { videoId, deviceId } = req.body;
      
      // Validar datos
      if (!videoId || !deviceId) {
        return res.status(400).json({
          error: 'El ID del video y el ID del dispositivo son obligatorios.'
        });
      }
      
      // Dar like usando el servicio
      const like = await likeService.darLike(videoId, deviceId);
      
      return res.status(201).json({
        mensaje: 'Like registrado con éxito',
        like
      });
    } catch (error) {
      // Si es un error de like duplicado, enviar mensaje personalizado
      if (error.message === 'Ya has dado like a este video') {
        return res.status(400).json({
          error: error.message
        });
      }
      next(error);
    }
  },
  
  // Quitar like a un video
  quitarLike: async (req, res, next) => {
    try {
      const { videoId, deviceId } = req.body;
      
      // Validar datos
      if (!videoId || !deviceId) {
        return res.status(400).json({
          error: 'El ID del video y el ID del dispositivo son obligatorios.'
        });
      }
      
      // Quitar like usando el servicio
      const resultado = await likeService.quitarLike(videoId, deviceId);
      
      return res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  },
  
  // Verificar si un dispositivo ya dio like a un video
  verificarLike: async (req, res, next) => {
    try {
      const { videoId } = req.params;
      const { deviceId } = req.query;
      
      // Validar datos
      if (!videoId || !deviceId) {
        return res.status(400).json({
          error: 'El ID del video y el ID del dispositivo son obligatorios.'
        });
      }
      
      // Verificar like usando el servicio
      const tienelike = await likeService.verificarLike(videoId, deviceId);
      
      return res.status(200).json({
        tienelike
      });
    } catch (error) {
      next(error);
    }
  },
  
  // Obtener todos los likes de un video
  obtenerLikesPorVideo: async (req, res, next) => {
    try {
      const { videoId } = req.params;
      
      // Validar datos
      if (!videoId) {
        return res.status(400).json({
          error: 'El ID del video es obligatorio.'
        });
      }
      
      // Obtener likes usando el servicio
      const likes = await likeService.obtenerLikesPorVideo(videoId);
      
      return res.status(200).json({
        likes,
        total: likes.length
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = likeControlador;