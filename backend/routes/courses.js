const express = require('express');
const Course = require('../models/Course');
const { verifyToken, verifyRole } = require('../middlewares/auth');
const router = express.Router();

// Público: Ver el listado de cursos (Next.js)
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Administrador: Crear un curso nuevo (Angular)
router.post('/', verifyToken, verifyRole(['administrador']), async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Estudiante: Inscribirse a un curso (React)
router.post('/:id/enroll', verifyToken, verifyRole(['estudiante']), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Curso no encontrado' });
    
    if (!course.estudiantes.includes(req.user.id)) {
      course.estudiantes.push(req.user.id);
      await course.save();
    }
    res.json({ message: 'Inscripción exitosa', course });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;