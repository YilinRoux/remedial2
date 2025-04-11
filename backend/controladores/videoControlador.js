const { videoService } = require('../servicios');

// Controlador para manejar las operaciones de videos
const videoControlador = {
  // Subir un nuevo video
  subirVideo: async (req, res, next) => {
    try {
      // Verificar si se recibió un archivo
      if (!req.file) {
        return res.status(400).json({
          error: 'No se ha proporcionado ningún archivo de video.'
        });
      }
      
      const { deviceId, title } = req.body;
      
      // Validar deviceId
      if (!deviceId) {
        return res.status(400).json({
          error: 'El ID del dispositivo es obligatorio.'
        });
      }
      
      // Subir el video usando el servicio
      const video = await videoService.subirVideo(
        req.file.path, 
        deviceId,
        title || ''
      );
      
      return res.status(201).json({
        mensaje: 'Video subido con éxito',
        video
      });
    } catch (error) {
      next(error);
    }
  },
  
  // Obtener lista de videos para el feed
  obtenerVideos: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      
      const resultado = await videoService.obtenerVideos(page, limit);
      
      return res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  },
  
  // Obtener un video específico por ID
  obtenerVideoPorId: async (req, res, next) => {
    try {
      const { id } = req.params;
      
      const video = await videoService.obtenerVideoPorId(id);
      
      return res.status(200).json(video);
    } catch (error) {
      next(error);
    }
  },
  
  // Eliminar un video
  eliminarVideo: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { deviceId } = req.body;
      
      // Primero verificar que el video exista
      const video = await videoService.obtenerVideoPorId(id);
      
      // Verificar que el dispositivo sea el propietario del video
      if (video.deviceId !== deviceId) {
        return res.status(403).json({
          error: 'No tienes permiso para eliminar este video.'
        });
      }
      
      // Eliminar el video
      const resultado = await videoService.eliminarVideo(id);
      
      return res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  },
  
  // Obtener videos de un dispositivo específico
  obtenerVideosPorDispositivo: async (req, res, next) => {
    try {
      const { deviceId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      
      // Consultar videos por deviceId
      const skip = (page - 1) * limit;
      
      const videos = await videoService.obtenerVideos(page, limit, { deviceId });
      
      return res.status(200).json(videos);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = videoControlador;