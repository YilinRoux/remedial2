const mongoose = require('mongoose');

const comentarioSchema = new mongoose.Schema({
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: [true, 'El ID del video es obligatorio']
  },
  deviceId: {
    type: String,
    required: [true, 'El ID del dispositivo es obligatorio']
  },
  text: {
    type: String,
    required: [true, 'El texto del comentario es obligatorio'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Índices para búsqueda rápida y ordenamiento
comentarioSchema.index({ videoId: 1 });
comentarioSchema.index({ createdAt: -1 });

const Comentario = mongoose.model('Comentario', comentarioSchema);

module.exports = Comentario;