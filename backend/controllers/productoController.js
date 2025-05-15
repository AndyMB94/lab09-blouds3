const productoModel = require('../models/productoModel');
const { uploadFile } = require('../services/s3Service');

exports.listar = (req, res) => {
  productoModel.getAll((err, rows) => {
    if (err) throw err;
    res.render('index', {
      productos: rows,
      bucket: process.env.AWS_BUCKET_NAME,
      region: process.env.AWS_REGION
    });
  });
};

exports.crear = async (req, res) => {
  const { nombre, descripcion, precio } = req.body;
  let imagen_key = '';

  if (req.file) {
    const result = await uploadFile(req.file);
    imagen_key = result.key;
  }

  productoModel.create({ nombre, descripcion, precio, imagen_key }, () => {
    res.redirect('/');
  });
};

exports.eliminar = (req, res) => {
  productoModel.delete(req.params.id, () => {
    res.redirect('/');
  });
};

exports.editarForm = (req, res) => {
  productoModel.getById(req.params.id, (err, rows) => {
    if (err) throw err;
    res.render('editar', {
      producto: rows[0],
      bucket: process.env.AWS_BUCKET_NAME,
      region: process.env.AWS_REGION
    });
  });
};

exports.editar = async (req, res) => {
  const { nombre, descripcion, precio, imagen_actual } = req.body;
  let imagen_key = imagen_actual;

  if (req.file) {
    const result = await uploadFile(req.file);
    imagen_key = result.key;
  }

  productoModel.update(req.params.id, {
    nombre, descripcion, precio, imagen_key
  }, () => {
    res.redirect('/');
  });
};
