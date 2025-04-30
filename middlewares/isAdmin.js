exports.isAdmin = (req, res, next) => {
  console.log('ROL RECIBIDO:', req.user?.role); // 👈 Depuración

  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).render('unauthorized', { message: 'Acceso denegado: solo administradores.' });
  }
};
