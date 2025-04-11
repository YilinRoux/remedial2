const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: [true, 'El ID del video es obligatorio']
  },
  deviceId: {
    type: String,
    required: [true, 'El ID del dispositivo es obligatorio']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Índice compuesto único para evitar likes duplicados
likeSchema.index({ videoId: 1, deviceId: 1 }, { unique: true });

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;