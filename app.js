const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const emailRoutes = require('./routes/emailRoutes');
const reportRoutes = require('./routes/reportRoutes');
const authMiddleware = require('./middlewares/authMiddleware'); // Importa correctamente
const dashboardRoutes = require('./routes/dashboard');

dotenv.config();
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Rutas de autenticación
app.use('/auth', authRoutes);

// Rutas privadas (requieren token)
app.use('/dashboard', authMiddleware.verifyToken, dashboardRoutes); // ✅ Solo dashboard aquí
app.use('/dashboard', authMiddleware.verifyToken, userRoutes); // ✅ Usuarios en /dashboard/users
app.use('/dashboard', authMiddleware.verifyToken, emailRoutes); // ✅ Correos en /dashboard/emails
app.use('/dashboard', authMiddleware.verifyToken, reportRoutes); // ✅ Reportes en /dashboard/reports

app.get('/', (req, res) => res.redirect('/auth/login'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
