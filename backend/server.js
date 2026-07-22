require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

const allowedOrigins = [
  'http://localhost:4200',
  'http://localhost:3001',
  'http://localhost:3002',
  'https://admin-panel-xi-plum.vercel.app',
  'https://catalogo-publico-phi.vercel.app',
  'https://portal-estudiante.vercel.app'
].filter(Boolean);

app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));

const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const profesoresRoutes = require('./routes/profesores');

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/profesores', profesoresRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB Atlas exitosamente'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));

app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.message === 'No permitido por CORS') {
    return res.status(403).json({ error: 'Origen no permitido' });
  }
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
