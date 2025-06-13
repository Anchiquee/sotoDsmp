#HOLA
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/isAdmin');
const User = require('../models/User');
const Email = require('../models/Email');
const Report = require('../models/Report');
const { getEmailConfig, saveEmailConfig, updateEmailConfig, deleteEmailConfig } = require('../models/EmailConfig');
const sendReportController = require('../controllers/sendReportController');

// Ruta para el dashboard
router.get('/', verifyToken, async (req, res) => {
  try {
    const users = await User.getAll();
    const totalUsers = users.length;
    const totalAdmins = users.filter(u => u.role === 'admin').length;

    const totalEmails = await Email.count();
    const totalReports = await Report.count();

    res.render('dashboard', { 
      user: req.user, 
      totalUsers, 
      totalEmails, 
      totalReports, 
      totalAdmins 
    });
  } catch (error) {
    console.error('Error cargando el dashboard:', error);
    res.status(500).send('Error cargando el dashboard.');
  }
});
  

// Rutas para usuarios
router.get('/users', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).render('unauthorized', { message: 'Acceso denegado: solo administradores.' });
  }

  const users = await User.getAll();
  res.render('users', { users, user: req.user });
});

router.post('/users/create', verifyToken, isAdmin, async (req, res) => {
  const { name, email, password, role } = req.body;
  console.log('Datos recibidos en POST /users/create:', req.body);

  if (!password || password.trim() === '') {
    const users = await User.getAll();
    return res.render('users', { users, user: req.user, message: 'La contraseña no puede estar vacía.' });
  }

  try {
    await User.create(name, email, password, role);
    res.redirect('/dashboard/users');
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    const users = await User.getAll();
    res.render('users', { users, user: req.user, message: message || '' });
  }
});

router.post('/users/update/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  console.log("Datos recibidos para actualizar:", { name, email, password, role });  // Agregado para depurar

  try {
    // Verificar que los campos obligatorios no estén vacíos
    if (!name || !email || !role) {
      return res.status(400).send('Los campos name, email y role son obligatorios');
    }

    // Llamamos al modelo para actualizar el usuario
    await User.update(id, name, email, password, role);
    
    // Redirigir a la lista de usuarios
    res.redirect('/dashboard/users');
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).send('Error al actualizar el usuario');
  }
});

router.get('/users/delete/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  await User.deleteUser(id);
  res.redirect('/dashboard/users');
});

// Rutas para correos
router.get('/emails', verifyToken, isAdmin, async (req, res) => {
  const emails = await Email.findAll();
  res.render('emails', { user: req.user, emails });
});

// Rutas para reportes
router.get('/reports', verifyToken, isAdmin, async (req, res) => {
  const reports = await Report.findAll();
  res.render('reports', { user: req.user, reports });
});

router.get('/reports/create', verifyToken, isAdmin, (req, res) => {
  res.render('createReport', { user: req.user });
});

router.post('/reports/create', verifyToken, isAdmin, async (req, res) => {
  const { title, description, db_host, db_port, db_user, db_password, db_name, db_query } = req.body;
  await Report.create({ title, description, db_host, db_port, db_user, db_password, db_name, db_query });
  const reports = await Report.findAll();
  res.render('reports', { user: req.user, reports, message: 'Reporte creado correctamente.' });
});

router.post('/reports/update/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, description, db_host, db_port, db_user, db_password, db_name, db_query } = req.body;

  try {
    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).send('Reporte no encontrado');
    }

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

    const reports = await Report.findAll();
    res.render('reports', { user: req.user, reports, message: 'Reporte actualizado correctamente.' });
  } catch (error) {
    console.error('Error actualizando el reporte:', error);
    res.status(500).send('Error actualizando el reporte.');
  }
});

router.get('/reports/delete/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).send('Reporte no encontrado');
    }

    const result = await Report.delete(id);
    if (result) {
      const reports = await Report.findAll();
      return res.render('reports', { user: req.user, reports, message: 'Reporte eliminado correctamente.' });
    } else {
      return res.status(500).send('Error eliminando el reporte.');
    }
  } catch (error) {
    console.error('Error eliminando el reporte:', error);
    res.status(500).send('Error eliminando el reporte.');
  }
});

// Configuración de correo
router.get('/config_email', verifyToken, isAdmin, async (req, res) => {
  try {
    const config = await getEmailConfig();
    res.render('config_email', { config, user: req.user, message: null });
  } catch (error) {
    console.error('Error obteniendo la configuración de correo:', error);
    res.status(500).send('Error obteniendo la configuración de correo');
  }
});

router.post('/config_email', verifyToken, isAdmin, async (req, res) => {
  try {
    const { smtpServer, emailAddress, emailPassword, smtpPort } = req.body;
    const existingConfig = await getEmailConfig();

    if (existingConfig && existingConfig.id) {
      await updateEmailConfig(smtpServer, emailAddress, emailPassword, smtpPort);
    } else {
      await saveEmailConfig(smtpServer, emailAddress, emailPassword, smtpPort);
    }

    const config = await getEmailConfig();
    res.render('config_email', { config, user: req.user, message: "Configuración guardada correctamente." });
  } catch (error) {
    console.error('Error guardando la configuración de correo:', error);
    const config = await getEmailConfig();
    res.render('config_email', { config, user: req.user, message: "Hubo un error al guardar la configuración." });
  }
});

router.post('/config_email/delete', verifyToken, isAdmin, async (req, res) => {
  try {
    await deleteEmailConfig();
    const config = await getEmailConfig();
    res.render('config_email', { config, user: req.user, message: 'Configuración de correo eliminada correctamente.' });
  } catch (error) {
    console.error('Error eliminando la configuración de correo:', error);
    const config = await getEmailConfig();
    res.render('config_email', { config, user: req.user, message: 'Hubo un error al eliminar la configuración.' });
  }
});

// Enviar reportes
router.get('/send_reports', sendReportController.showReports);
router.post('/send_reports/send', sendReportController.sendReports);

module.exports = router;
