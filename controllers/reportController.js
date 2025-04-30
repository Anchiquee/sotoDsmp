// controllers/reportController.js
const Report = require('../models/Report');

exports.index = async (req, res) => {
  const reports = await Report.findAll();
  const user = req.user;
  res.render('reports', { reports, user });
};

exports.create = async (req, res) => {
  const {
    title, description, db_host, db_port,
    db_user, db_password, db_name, db_query
  } = req.body;

  if (!title) {
    return res.status(400).send("El campo título es obligatorio.");
  }

  try {
    await Report.create({
      title,
      description,
      db_host,
      db_port,
      db_user,
      db_password,
      db_name,
      db_query
    });

    res.redirect('/dashboard/reports');
  } catch (error) {
    console.error('Error creando el reporte:', error);
    res.status(500).send('Error al crear el reporte.');
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const {
    title, description, db_host, db_port,
    db_user, db_password, db_name, db_query
  } = req.body;

  try {
    await Report.update(id, {
      title,
      description,
      db_host,
      db_port,
      db_user,
      db_password,
      db_name,
      db_query
    });

    res.redirect('/dashboard/reports');
  } catch (error) {
    console.error('Error actualizando el reporte:', error);
    res.status(500).send('Error al actualizar el reporte.');
  }
};

exports.delete = async (req, res) => {
  try {
    await Report.delete(req.params.id);
    res.redirect('/dashboard/reports');
  } catch (error) {
    console.error('Error eliminando el reporte:', error);
    res.status(500).send('Error al eliminar el reporte.');
  }
};
