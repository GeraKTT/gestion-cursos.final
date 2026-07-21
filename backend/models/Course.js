const mongoose = require('mongoose');

const coursesSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  profesor: { type: mongoose.Schema.Types.ObjectId, ref: 'Profesor' },
  estudiantes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Course', coursesSchema);