const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { verifyToken, verifyRole } = require('../middlewares/auth');

router.get('/', courseController.getAll);
router.get('/student/my-enrollments', verifyToken, verifyRole(['estudiante']), courseController.myEnrollments);
router.get('/:id', courseController.getById);
router.post('/', verifyToken, verifyRole(['administrador']), courseController.create);
router.put('/:id', verifyToken, verifyRole(['administrador']), courseController.update);
router.delete('/:id', verifyToken, verifyRole(['administrador']), courseController.remove);
router.post('/:id/enroll', verifyToken, verifyRole(['estudiante']), courseController.enroll);

module.exports = router;
