const { Comentario } = require('../modelos');
const videoService = require('./videoService');

class ComentarioService {
  // Crear un nuevo comentario
  async crearComentario(videoId, deviceId, text) {
    try {
      // Crear nuevo comentario
      const nuevoComentario = new Comentario({
        videoId,
        deviceId,
        text,
        createdAt: new Date()
      });
      
      // Guardar en la base de datos
      await nuevoComentario.save();
      
      // Incrementar el contador de comentarios en el video
      await videoService.incrementarComentarios(videoId);
      
      return nuevoComentario;
    } catch (error) {
      console.error(`Error al crear comentario para el video ${videoId}:`, error);
      throw error;
    }
  }
  
  // Obtener comentarios de un video
  async obtenerComentariosPorVideo(videoId, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;
      
      const comentarios = await Comentario.find({ videoId })
                                         .sort({ createdAt: -1 })
                                         .skip(skip)
                                         .limit(limit);
      
      const total = await Comentario.countDocuments({ videoId });
      
      return {
        comentarios,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      };
    } catch (error) {
      console.error(`Error al obtener comentarios del video ${videoId}:`, error);
      throw error;
    }
  }
  
  // Eliminar un comentario
  async eliminarComentario(comentarioId, deviceId) {
    try {
      const comentario = await Comentario.findById(comentarioId);
      
      if (!comentario) {
        throw new Error('Comentario no encontrado');
      }
      
      // Verificar que el comentario pertenece al dispositivo
      if (comentario.deviceId !== deviceId) {
        throw new Error('No tienes permiso para eliminar este comentario');
      }
      
      // Eliminar el comentario
      await Comentario.findByIdAndDelete(comentarioId);
      
      return { mensaje: 'Comentario eliminado correctamente' };
    } catch (error) {
      console.error(`Error al eliminar comentario ${comentarioId}:`, error);
      throw error;
    }
  }
  
  // Obtener un comentario específico por ID
  async obtenerComentarioPorId(comentarioId) {
    try {
      const comentario = await Comentario.findById(comentarioId);
      
      if (!comentario) {
        throw new Error('Comentario no encontrado');
      }
      
      return comentario;
    } catch (error) {
      console.error(`Error al obtener comentario ${comentarioId}:`, error);
      throw error;
    }
  }
}

module.exports = new ComentarioService();