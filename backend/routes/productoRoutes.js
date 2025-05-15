const express = require('express');
const router = express.Router();
const multer = require('multer');
const controller = require('../controllers/productoController');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/', controller.listar);
router.post('/crear', upload.single('imagen'), controller.crear);
router.post('/eliminar/:id', controller.eliminar);
router.get('/editar/:id', controller.editarForm);
router.post('/editar/:id', upload.single('imagen'), controller.editar);

module.exports = router;
