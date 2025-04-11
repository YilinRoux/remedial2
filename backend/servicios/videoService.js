const cloudflareService = require('./cloudflareService');
const { Video } = require('../modelos');
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

class VideoService {
  // Subir un nuevo video
  async subirVideo(filePath, deviceId, title = '') {
    try {
      // Subir a Cloudflare
      const cloudflareData = await cloudflareService.subirVideo(filePath);
      
      // Crear nuevo documento de video en MongoDB
      const nuevoVideo = new Video({
        title,
        cloudflareUrl: cloudflareData.cloudflareUrl,
        cloudflareId: cloudflareData.cloudflareId,
        thumbnailUrl: cloudflareData.thumbnailUrl,
        metadata: {
          duration: cloudflareData.metadata.duration,
          size: cloudflareData.metadata.size,
          width: cloudflareData.metadata.width,
          height: cloudflareData.metadata.height
        },
        deviceId,
        likeCount: 0,
        commentCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Guardar en la base de datos
      await nuevoVideo.save();
      
      // Eliminar archivo temporal
      await unlinkAsync(filePath);
      
      return nuevoVideo;
    } catch (error) {
      // Si hay error, intentar eliminar el archivo temporal
      try {
        await unlinkAsync(filePath);
      } catch (unlinkError) {
        console.error('Error al eliminar archivo temporal:', unlinkError);
      }
      
      console.error('Error en servicio de video:', error);
      throw error;
    }
  }
  
  // Obtener lista de videos para el feed
  async obtenerVideos(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const videos = await Video.find()
                                .sort({ createdAt: -1 })
                                .skip(skip)
                                .limit(limit);
      
      const total = await Video.countDocuments();
      
      return {
        videos,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      };
    } catch (error) {
      console.error('Error al obtener videos:', error);
      throw error;
    }
  }
  
  // Obtener un video específico por ID
  async obtenerVideoPorId(videoId) {
    try {
      const video = await Video.findById(videoId);
      
      if (!video) {
        throw new Error('Video no encontrado');
      }
      
      return video;
    } catch (error) {
      console.error(`Error al obtener video ${videoId}:`, error);
      throw error;
    }
  }
  
  // Eliminar un video
  async eliminarVideo(videoId) {
    try {
      const video = await Video.findById(videoId);
      
      if (!video) {
        throw new Error('Video no encontrado');
      }
      
      // Eliminar el video de Cloudflare
      await cloudflareService.eliminarVideo(video.cloudflareId);
      
      // Eliminar de la base de datos
      await Video.findByIdAndDelete(videoId);
      
      return { mensaje: 'Video eliminado correctamente' };
    } catch (error) {
      console.error(`Error al eliminar video ${videoId}:`, error);
      throw error;
    }
  }
  
  // Incrementar contador de likes
  async incrementarLikes(videoId) {
    try {
      const video = await Video.findByIdAndUpdate(
        videoId,
        { $inc: { likeCount: 1 } },
        { new: true }
      );
      
      if (!video) {
        throw new Error('Video no encontrado');
      }
      
      return video;
    } catch (error) {
      console.error(`Error al incrementar likes del video ${videoId}:`, error);
      throw error;
    }
  }
  
  // Decrementar contador de likes
  async decrementarLikes(videoId) {
    try {
      const video = await Video.findByIdAndUpdate(
        videoId,
        { $inc: { likeCount: -1 } },
        { new: true }
      );
      
      if (!video) {
        throw new Error('Video no encontrado');
      }
      
      return video;
    } catch (error) {
      console.error(`Error al decrementar likes del video ${videoId}:`, error);
      throw error;
    }
  }
  
  // Incrementar contador de comentarios
  async incrementarComentarios(videoId) {
    try {
      const video = await Video.findByIdAndUpdate(
        videoId,
        { $inc: { commentCount: 1 } },
        { new: true }
      );
      
      if (!video) {
        throw new Error('Video no encontrado');
      }
      
      return video;
    } catch (error) {
      console.error(`Error al incrementar comentarios del video ${videoId}:`, error);
      throw error;
    }
  }
}

module.exports = new VideoService();