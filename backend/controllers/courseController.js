const Course = require('../models/Course');

exports.getAll = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query.titulo = { $regex: search, $options: 'i' };
    }

    const courses = await Course.find(query).populate('profesor', 'nombre especialidad');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor al obtener cursos' });
  }
};

exports.getById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('profesor', 'nombre especialidad correo');
    if (!course) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor al obtener el curso' });
  }
};

exports.create = async (req, res) => {
  try {
    const { titulo, descripcion, profesor } = req.body;

    if (!titulo || !descripcion) {
      return res.status(400).json({ error: 'Título y descripción son obligatorios' });
    }

    const course = new Course({ titulo, descripcion, profesor });
    await course.save();
    const populated = await Course.findById(course._id).populate('profesor', 'nombre especialidad');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { titulo, descripcion, profesor } = req.body;
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { titulo, descripcion, profesor },
      { new: true, runValidators: true }
    ).populate('profesor', 'nombre especialidad');

    if (!course) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    res.json(course);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    res.json({ message: 'Curso eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor al eliminar el curso' });
  }
};

exports.enroll = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    if (course.estudiantes.includes(req.user.id)) {
      return res.status(400).json({ error: 'Ya estás inscrito en este curso' });
    }

    course.estudiantes.push(req.user.id);
    await course.save();
    res.json({ message: 'Inscripción exitosa', course });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.myEnrollments = async (req, res) => {
  try {
    const courses = await Course.find({ estudiantes: req.user.id }).populate('profesor', 'nombre especialidad');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor al obtener inscripciones' });
  }
};
