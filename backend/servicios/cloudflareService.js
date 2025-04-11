const fs = require('fs-extra');
const fetch = require('node-fetch');
const FormData = require('form-data');
const path = require('path');
const cloudflareConfig = require('../config/cloudflare');

// Servicio para interactuar con Cloudflare Stream
class CloudflareService {

  // Subir un video a Cloudflare Stream
  async subirVideo(filePath) {
    try {
      console.log(`[CloudflareService] Iniciando subida de ${filePath}`);

      // Verificar que el archivo exista
      const exists = await fs.pathExists(filePath);
      if (!exists) {
        throw new Error(`El archivo ${filePath} no existe`);
      }

      // Obtener información del archivo
      const stats = await fs.stat(filePath);
      console.log(`[CloudflareService] Tamaño del archivo: ${stats.size} bytes`);

      // Crear el form data y agregar el archivo
      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));
      
      // Si queremos agregar opciones adicionales como requiredSignedURLs
      form.append('requireSignedURLs', 'false');
      
      console.log(`[CloudflareService] Subiendo archivo a Cloudflare: ${filePath}`);
      
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
      console.log(`[CloudflareService] Video subido exitosamente, ID: ${data.result.uid}`);
      
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
      console.error('[CloudflareService] Error:', error);
      throw new Error(`Error al subir video: ${error.message}`);
    }
  }

  // Eliminar un video de Cloudflare Stream por su ID
  async eliminarVideo(videoId) {
    try {
      console.log(`[CloudflareService] Eliminando video con ID: ${videoId}`);
      
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
      
      console.log(`[CloudflareService] Video eliminado exitosamente: ${videoId}`);
      return true;
    } catch (error) {
      console.error('[CloudflareService] Error al eliminar video:', error);
      throw new Error(`Error al eliminar video: ${error.message}`);
    }
  }

  // Obtener información de un video por su ID
  async obtenerInfoVideo(videoId) {
    try {
      console.log(`[CloudflareService] Obteniendo información del video: ${videoId}`);
      
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
      
      const data = await response.json();
      console.log(`[CloudflareService] Información obtenida para video: ${videoId}`);
      
      return data;
    } catch (error) {
      console.error('[CloudflareService] Error al obtener información del video:', error);
      throw new Error(`Error al obtener información: ${error.message}`);
    }
  }
}

module.exports = new CloudflareService();