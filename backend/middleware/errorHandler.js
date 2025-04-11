// Middleware para manejar errores
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    // Error de Multer para tamaño de archivo
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: `El archivo excede el tamaño máximo permitido de ${process.env.MAX_VIDEO_SIZE / (1024 * 1024)} MB.`
      });
    }
    
    // Errores de MongoDB para documentos duplicados (como likes duplicados)
    if (err.code === 11000) {
      return res.status(400).json({
        error: 'Ya existe un registro con estos datos.'
      });
    }
  
    // Error de validación de Mongoose
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        error: messages.join(', ')
      });
    }
  
    // Error de casting de ID de MongoDB
    if (err.name === 'CastError') {
      return res.status(400).json({
        error: 'ID no válido.'
      });
    }
  
    // Error genérico
    return res.status(500).json({
      error: 'Error en el servidor. Por favor, inténtalo de nuevo más tarde.'
    });
  };
  
  module.exports = errorHandler;