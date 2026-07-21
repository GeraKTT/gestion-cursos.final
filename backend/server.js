require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Seguridad y Middlewares 
app.use(helmet()); 
app.use(cors()); 
app.use(express.json());

// Importar rutas
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const profesoresRoutes = require('./routes/profesores');

// Rutas API REST modular 
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/profesores', profesoresRoutes);

// Conexión base de datos
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a la base de datos de forma exitosa'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));

// Middleware manejo de errores 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Inicialización del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});