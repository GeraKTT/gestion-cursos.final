const Profesor = require('../models/Profesor');

exports.getAll = async (req, res) => {
  try {
    const profesores = await Profesor.find();
    res.json(profesores);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los profesores' });
  }
};

exports.getById = async (req, res) => {
  try {
    const profesor = await Profesor.findById(req.params.id);
    if (!profesor) {
      return res.status(404).json({ error: 'Profesor no encontrado' });
    }
    res.json(profesor);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el profesor' });
  }
};

exports.create = async (req, res) => {
  try {
    const { nombre, especialidad, correo } = req.body;

    if (!nombre || !especialidad || !correo) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const nuevoProfesor = new Profesor({ nombre, especialidad, correo });
    await nuevoProfesor.save();
    res.status(201).json(nuevoProfesor);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }
    res.status(400).json({ error: 'Error al crear el profesor', detalle: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { nombre, especialidad, correo } = req.body;
    const profesor = await Profesor.findByIdAndUpdate(
      req.params.id,
      { nombre, especialidad, correo },
      { new: true, runValidators: true }
    );

    if (!profesor) {
      return res.status(404).json({ error: 'Profesor no encontrado' });
    }
    res.json(profesor);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar el profesor', detalle: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const profesor = await Profesor.findByIdAndDelete(req.params.id);
    if (!profesor) {
      return res.status(404).json({ error: 'Profesor no encontrado' });
    }
    res.json({ message: 'Profesor eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el profesor' });
  }
};
