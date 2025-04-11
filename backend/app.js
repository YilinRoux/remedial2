const express = require('express');
const cors = require('cors');
const path = require('path');
const conectarBD = require('./config/baseDatos');
const rutas = require('./rutas');
const errorHandler = require('./middleware/errorHandler');

// Cargar variables de entorno
require('dotenv').config();

// Crear la aplicación Express
const app = express();

// Conectar a MongoDB
conectarBD();

// Middleware básicos
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (si es necesario)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configurar las rutas
app.use('/api', rutas);

// Middleware para manejar errores
app.use(errorHandler);

// Configurar puerto
const PORT = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Manejo de eventos no capturados
process.on('unhandledRejection', (err) => {
  console.error('Error no capturado:', err);
});

module.exports = app;