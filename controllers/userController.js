const User = require('../models/User'); // Asegúrate de importar correctamente el modelo

// Controlador para obtener todos los usuarios
exports.index = async (req, res) => {
  try {
    const users = await User.getAll(); // Obtenemos todos los usuarios desde la base de datos
    res.render('users', { users, user: req.user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los usuarios');
  }
};

// Controlador para crear un nuevo usuario
exports.create = async (req, res) => {
  const { name, email, password, role } = req.body;
  
  try {
    if (!name || !email || !password || !role) {
      return res.status(400).send('Los campos son obligatorios');
    }

    // Crear el nuevo usuario
    const newUser = await User.create(name, email, password, role);
    
    res.redirect('/dashboard/users');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear el usuario');
  }
};

// Controlador para actualizar un usuario
exports.update = async (req, res) => {
  const { name, email, password, role } = req.body;
  const id = req.params.id;

  console.log("Datos recibidos para actualizar:", { name, email, password, role });

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
};

// Controlador para eliminar un usuario
exports.delete = async (req, res) => {
  const id = req.params.id;
  
  try {
    // Llamar al modelo para eliminar el usuario
    await User.deleteUser(id);
    
    // Redirigir a la lista de usuarios
    res.redirect('/dashboard/users');
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).send('Error al eliminar el usuario');
  }
};
