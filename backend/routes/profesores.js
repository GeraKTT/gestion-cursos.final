const express = require('express');
const router = express.Router();
const profesorController = require('../controllers/profesorController');
const { verifyToken, verifyRole } = require('../middlewares/auth');

router.get('/', profesorController.getAll);
router.get('/:id', profesorController.getById);
router.post('/', verifyToken, verifyRole(['administrador']), profesorController.create);
router.put('/:id', verifyToken, verifyRole(['administrador']), profesorController.update);
router.delete('/:id', verifyToken, verifyRole(['administrador']), profesorController.remove);

module.exports = router;
