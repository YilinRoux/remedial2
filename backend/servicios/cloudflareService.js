const fs = require('fs');
const fetch = require('node-fetch');
const FormData = require('form-data');
const cloudflareConfig = require('../config/cloudflare');

// Servicio para interactuar con Cloudflare Stream
class CloudflareService {
  
  // Subir un video a Cloudflare Stream
  async subirVideo(filePath) {
    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));
      
      // Si queremos agregar opciones adicionales como requiredSignedURLs
      form.append('requireSignedURLs', 'false');
      
      const response = await fetch(`${cloudflareConfig.apiBaseUrl}/direct_upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cloudflareConfig.token}`
        },
        body: form
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al subir video a Cloudflare: ${JSON.stringify(errorData)}`);
      }
      
      const data = await response.json();
      
      // Construir la URL de reproducción
      const videoUrl = `https://${cloudflareConfig.customerSubdomain}/${data.result.uid}/watch`;
      
      return {
        cloudflareId: data.result.uid,
        cloudflareUrl: videoUrl,
        thumbnailUrl: `https://${cloudflareConfig.customerSubdomain}/${data.result.uid}/thumbnails/thumbnail.jpg`,
        metadata: {
          width: data.result.input?.width || 0,
          height: data.result.input?.height || 0,
          duration: data.result.duration || 0,
          size: data.result.size || 0
        }
      };
    } catch (error) {
      console.error('Error en servicio de Cloudflare:', error);
      throw new Error(`Error al subir video: ${error.message}`);
    }
  }
  
  // Eliminar un video de Cloudflare Stream por su ID
  async eliminarVideo(videoId) {
    try {
      const response = await fetch(`${cloudflareConfig.apiBaseUrl}/${videoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${cloudflareConfig.token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al eliminar video de Cloudflare: ${JSON.stringify(errorData)}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error al eliminar video de Cloudflare:', error);
      throw new Error(`Error al eliminar video: ${error.message}`);
    }
  }
  
  // Obtener información de un video por su ID
  async obtenerInfoVideo(videoId) {
    try {
      const response = await fetch(`${cloudflareConfig.apiBaseUrl}/${videoId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${cloudflareConfig.token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al obtener información del video: ${JSON.stringify(errorData)}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error al obtener información del video:', error);
      throw new Error(`Error al obtener información: ${error.message}`);
    }
  }
}

module.exports = new CloudflareService();