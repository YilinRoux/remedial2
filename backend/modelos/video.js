const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true
  },
  cloudflareUrl: {
    type: String,
    required: [true, 'La URL de Cloudflare es obligatoria']
  },
  cloudflareId: {
    type: String,
    required: [true, 'El ID de Cloudflare es obligatorio']
  },
  thumbnailUrl: {
    type: String
  },
  metadata: {
    duration: {
      type: Number,
      required: [true, 'La duración del video es obligatoria']
    },
    size: {
      type: Number,
      required: [true, 'El tamaño del video es obligatorio']
    },
    width: {
      type: Number
    },
    height: {
      type: Number
    }
  },
  deviceId: {
    type: String,
    required: [true, 'El ID del dispositivo es obligatorio']
  },
  likeCount: {
    type: Number,
    default: 0
  },
  commentCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Índice para ordenar por fecha
videoSchema.index({ createdAt: -1 });

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;