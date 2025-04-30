const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    console.log('No hay token');
    return res.redirect('/auth/login');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('Token inválido:', err.message);
      return res.redirect('/auth/login');
    }

    console.log('Token decodificado:', decoded); // 👈 Imprime el contenido del token
    req.user = decoded;
    next();
  });
};
