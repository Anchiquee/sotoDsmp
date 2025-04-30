const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Muestra el formulario de login
exports.loginForm = (req, res) => {
  res.render('login', { error: null });
};

// Controlador para login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findByEmail(email);

  if (!user) {
    return res.render('login', { error: 'Usuario no encontrado' });
  }

const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.render('login', { error: 'Contraseña incorrecta' });
  }

const token = jwt.sign({ id: user.id, email: user.email, role: user.role  }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.cookie('token', token, { httpOnly: true });
  res.redirect('/dashboard');  // Redirige a dashboard si el login es exitoso
};

// Controlador para logout
exports.logout = (req, res) => {
  res.clearCookie('token');  // Elimina el cookie con el token
  res.redirect('/auth/login');  // Redirige a la página de login
};
