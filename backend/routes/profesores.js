const express = require('express');
const router = express.Router();
const Profesor = require('../models/Profesor');

// GET: Listar profesores
router.get('/', async (req, res) => {
  try {
    const profesores = await Profesor.find();
    res.json(profesores);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los profesores' });
  }
});

// POST: Crear profesor
router.post('/', async (req, res) => {
  try {
    const nuevoProfesor = new Profesor(req.body);
    await nuevoProfesor.save();
    res.status(201).json(nuevoProfesor);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear el profesor', error: error.message });
  }
});

module.exports = router;