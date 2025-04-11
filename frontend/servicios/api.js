import axios from 'axios';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';


const API_URL = Constants.expoConfig.extra.apiUrl || 'http://192.34.61.11/api';
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


const apiService = {
  
  videos: {
    
    obtenerVideos: async (page = 1, limit = 10) => {
      try {
        const response = await api.get(`/videos?page=${page}&limit=${limit}`);
        return response.data;
      } catch (error) {
        console.error('Error al obtener videos:', error);
        throw error;
      }
    },
    
   
    obtenerVideoPorId: async (id) => {
      try {
        const response = await api.get(`/videos/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Error al obtener video ${id}:`, error);
        throw error;
      }
    },
    
    
    subirVideo: async (videoUri, deviceId, title = '') => {
      try {
        console.log(`Iniciando subida de video: ${videoUri}`);
        console.log(`Device ID: ${deviceId}`);
   
        const fileInfo = await FileSystem.getInfoAsync(videoUri);
        console.log(`Tamaño del archivo: ${fileInfo.size} bytes`);

        const formData = new FormData();

        const uriParts = videoUri.split('.');
        const fileExtension = uriParts[uriParts.length - 1];
        const fileName = `video.${fileExtension}`;

        let fileType;
        switch (fileExtension.toLowerCase()) {
          case 'mov':
            fileType = 'video/quicktime';
            break;
          case 'mp4':
            fileType = 'video/mp4';
            break;
          case 'avi':
            fileType = 'video/x-msvideo';
            break;
          case 'wmv':
            fileType = 'video/x-ms-wmv';
            break;
          default:
            fileType = `video/${fileExtension}`;
        }
        
        console.log(`Tipo de archivo: ${fileType}`);
        console.log(`Nombre de archivo: ${fileName}`);
   
        formData.append('video', {
          uri: videoUri,
          name: fileName,
          type: fileType,
        });
        

        formData.append('deviceId', deviceId);
        if (title) {
          formData.append('title', title);
        }
        
  
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            
            console.log(`Progreso de subida: ${percentCompleted}%`);

            if (this.onProgressCallback) {
              this.onProgressCallback(percentCompleted);
            }
          },

          timeout: 60000 * 5, 
        };
        
        console.log('Enviando solicitud al servidor...');
        

        const response = await api.post('/videos', formData, config);
        console.log('Respuesta recibida:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error al subir video:', error);
        if (error.response) {
     
          console.error('Datos de respuesta:', error.response.data);
          console.error('Estado HTTP:', error.response.status);
          console.error('Cabeceras:', error.response.headers);
        } else if (error.request) {

          console.error('No se recibió respuesta del servidor:', error.request);
        } else {
          
          console.error('Error al configurar la solicitud:', error.message);
        }
        throw error;
      }
    },
    

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
    

    onProgress: function(callback) {
      this.onProgressCallback = callback;
      return this;
    },
  },
  
 
  likes: {

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
  

  comentarios: {

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
    

    obtenerComentariosPorVideo: async (videoId, page = 1, limit = 20) => {
      try {
        const response = await api.get(`/comentarios/video/${videoId}?page=${page}&limit=${limit}`);
        return response.data;
      } catch (error) {
        console.error(`Error al obtener comentarios del video ${videoId}:`, error);
        throw error;
      }
    },
    

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