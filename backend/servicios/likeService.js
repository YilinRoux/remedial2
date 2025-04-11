const { Like } = require('../modelos');
const videoService = require('./videoService');

class LikeService {
  // Dar like a un video
  async darLike(videoId, deviceId) {
    try {
      // Verificar si ya existe un like de este dispositivo para este video
      const likeExistente = await Like.findOne({ videoId, deviceId });
      
      if (likeExistente) {
        throw new Error('Ya has dado like a este video');
      }
      
      // Crear nuevo like
      const nuevoLike = new Like({
        videoId,
        deviceId,
        createdAt: new Date()
      });
      
      // Guardar en la base de datos
      await nuevoLike.save();
      
      // Incrementar el contador de likes en el video
      await videoService.incrementarLikes(videoId);
      
      return nuevoLike;
    } catch (error) {
      console.error(`Error al dar like al video ${videoId}:`, error);
      throw error;
    }
  }
  
  // Quitar like a un video
  async quitarLike(videoId, deviceId) {
    try {
      // Buscar y eliminar el like
      const resultado = await Like.findOneAndDelete({ videoId, deviceId });
      
      if (!resultado) {
        throw new Error('No has dado like a este video');
      }
      
      // Decrementar el contador de likes en el video
      await videoService.decrementarLikes(videoId);
      
      return { mensaje: 'Like eliminado correctamente' };
    } catch (error) {
      console.error(`Error al quitar like del video ${videoId}:`, error);
      throw error;
    }
  }
  
  // Verificar si un dispositivo ya dio like a un video
  async verificarLike(videoId, deviceId) {
    try {
      const like = await Like.findOne({ videoId, deviceId });
      return !!like; // Retorna true si existe, false si no
    } catch (error) {
      console.error(`Error al verificar like del video ${videoId}:`, error);
      throw error;
    }
  }
  
  // Obtener todos los likes de un video
  async obtenerLikesPorVideo(videoId) {
    try {
      const likes = await Like.find({ videoId }).sort({ createdAt: -1 });
      return likes;
    } catch (error) {
      console.error(`Error al obtener likes del video ${videoId}:`, error);
      throw error;
    }
  }
}

module.exports = new LikeService();