const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);
const { execFile } = require('child_process');
const { videoLimits } = require('../config/cloudflare');

// Configuración de multer para almacenar archivos temporalmente
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir = './uploads/temp';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro para verificar tipo de archivo
const fileFilter = (req, file, cb) => {
  // Verificar tipos MIME para videos
  const allowedMimeTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo se aceptan videos (MP4, MOV, AVI, WMV).'), false);
  }
};

// Configurar multer con límites
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: videoLimits.maxSize // 50MB
  }
});

// Middleware para validar el tamaño y tipo de archivo
const validarArchivo = upload.single('video');

// Middleware para validar la duración del video usando ffprobe
const validarDuracion = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      error: 'No se ha proporcionado ningún archivo de video.'
    });
  }

  const filePath = req.file.path;
  
  try {
    // Obtenemos la duración del video usando FFprobe (dependencia externa)
    const duration = await getDuration(filePath);
    
    if (duration > videoLimits.maxDuration) {
      // Si el video es demasiado largo, eliminar el archivo temporal
      await unlinkAsync(filePath);
      return res.status(400).json({
        error: `La duración del video excede el límite permitido de ${videoLimits.maxDuration} segundos.`
      });
    }
    
    // Guardamos los metadatos en el objeto request para usarlos más tarde
    req.videoMetadata = {
      duration: duration,
      size: req.file.size
    };
    
    next();
  } catch (error) {
    // Si ocurre un error, eliminar el archivo temporal
    try {
      await unlinkAsync(filePath);
    } catch (unlinkError) {
      console.error('Error al eliminar archivo temporal:', unlinkError);
    }
    
    console.error('Error al validar la duración del video:', error);
    return res.status(500).json({
      error: 'Error al procesar el video. Por favor, inténtalo de nuevo.'
    });
  }
};

// Función auxiliar para obtener la duración del video con FFprobe
function getDuration(filePath) {
  return new Promise((resolve, reject) => {
    // En un entorno real, necesitarías instalar ffprobe
    execFile('ffprobe', [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1',
      filePath
    ], (error, stdout, stderr) => {
      if (error) {
        // Si ffprobe no está disponible, usar un valor predeterminado para propósitos de desarrollo
        console.warn('FFprobe no disponible, usando estimación de duración basada en tamaño');
        // Estimación muy aproximada basada en el tamaño del archivo
        const stats = fs.statSync(filePath);
        const fileSizeInBytes = stats.size;
        // Asumiendo una tasa de bits promedio de 1MB por 8 segundos de video
        const estimatedDuration = fileSizeInBytes / (1024 * 1024 * 8);
        resolve(estimatedDuration);
      } else {
        resolve(parseFloat(stdout.trim()));
      }
    });
  });
}

module.exports = {
  validarArchivo,
  validarDuracion
};