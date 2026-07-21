const mongoose = require('mongoose');

const profesorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  especialidad: { type: String, required: true },
  correo: { type: String, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Profesor', profesorSchema);