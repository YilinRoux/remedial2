import axios from 'axios';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';

// Obtener la URL base de la API desde las configuraciones de la app
const API_URL = Constants.expoConfig.extra.apiUrl || 'https://lavacalola.club/api';

// Crear una instancia de axios con la configuración base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Servicio para manejar las peticiones a la API
const apiService = {
  // Servicios para videos
  videos: {
    // Obtener lista de videos para el feed
    obtenerVideos: async (page = 1, limit = 10) => {
      try {
        const response = await api.get(`/videos?page=${page}&limit=${limit}`);
        return response.data;
      } catch (error) {
        console.error('Error al obtener videos:', error);
        throw error;
      }
    },
    
    // Obtener un video específico por ID
    obtenerVideoPorId: async (id) => {
      try {
        const response = await api.get(`/videos/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Error al obtener video ${id}:`, error);
        throw error;
      }
    },
    
    // Subir un nuevo video
    subirVideo: async (videoUri, deviceId, title = '') => {
      try {
        // Crear un FormData para enviar el archivo
        const formData = new FormData();
        
        // Obtener la extensión del archivo
        const fileExtension = videoUri.split('.').pop();
        
        // Agregar el archivo al FormData
        formData.append('video', {
          uri: videoUri,
          name: `video.${fileExtension}`,
          type: `video/${fileExtension === 'mov' ? 'quicktime' : fileExtension}`,
        });
        
        // Agregar los datos adicionales
        formData.append('deviceId', deviceId);
        if (title) {
          formData.append('title', title);
        }
        
        // Configurar la petición para subir el archivo
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            
            // Emitir evento de progreso
            if (this.onProgressCallback) {
              this.onProgressCallback(percentCompleted);
            }
          },
        };
        
        // Realizar la petición
        const response = await api.post('/videos/subir', formData, config);
        return response.data;
      } catch (error) {
        console.error('Error al subir video:', error);
        throw error;
      }
    },
    
    // Eliminar un video
    eliminarVideo: async (id, deviceId) => {
      try {
        const response = await api.delete(`/videos/${id}`, {
          data: { deviceId },
        });
        return response.data;
      } catch (error) {
        console.error(`Error al eliminar video ${id}:`, error);
        throw error;
      }
    },
    
    // Registrar callback para el progreso de subida
    onProgress: function(callback) {
      this.onProgressCallback = callback;
      return this;
    },
  },
  
  // Servicios para likes
  likes: {
    // Dar like a un video
    darLike: async (videoId, deviceId) => {
      try {
        const response = await api.post('/likes', {
          videoId,
          deviceId,
        });
        return response.data;
      } catch (error) {
        console.error(`Error al dar like al video ${videoId}:`, error);
        throw error;
      }
    },
    
    // Quitar like a un video
    quitarLike: async (videoId, deviceId) => {
      try {
        const response = await api.delete('/likes', {
          data: {
            videoId,
            deviceId,
          },
        });
        return response.data;
      } catch (error) {
        console.error(`Error al quitar like del video ${videoId}:`, error);
        throw error;
      }
    },
    
    // Verificar si un dispositivo ya dio like a un video
    verificarLike: async (videoId, deviceId) => {
      try {
        const response = await api.get(`/likes/verificar/${videoId}?deviceId=${deviceId}`);
        return response.data.tienelike;
      } catch (error) {
        console.error(`Error al verificar like del video ${videoId}:`, error);
        throw error;
      }
    },
  },
  
  // Servicios para comentarios
  comentarios: {
    // Crear un nuevo comentario
    crearComentario: async (videoId, deviceId, text) => {
      try {
        const response = await api.post('/comentarios', {
          videoId,
          deviceId,
          text,
        });
        return response.data;
      } catch (error) {
        console.error(`Error al crear comentario para el video ${videoId}:`, error);
        throw error;
      }
    },
    
    // Obtener comentarios de un video
    obtenerComentariosPorVideo: async (videoId, page = 1, limit = 20) => {
      try {
        const response = await api.get(`/comentarios/video/${videoId}?page=${page}&limit=${limit}`);
        return response.data;
      } catch (error) {
        console.error(`Error al obtener comentarios del video ${videoId}:`, error);
        throw error;
      }
    },
    
    // Eliminar un comentario
    eliminarComentario: async (id, deviceId) => {
      try {
        const response = await api.delete(`/comentarios/${id}`, {
          data: { deviceId },
        });
        return response.data;
      } catch (error) {
        console.error(`Error al eliminar comentario ${id}:`, error);
        throw error;
      }
    },
  },
};

export default apiService;