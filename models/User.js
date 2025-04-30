const db = require('../config/db'); // Asegúrate de importar correctamente tu conexión a la base de datos
const bcrypt = require('bcrypt'); // Si estás utilizando bcrypt para encriptar las contraseñas

// Modelo para obtener todos los usuarios
async function getAll() {
  try {
    const [users] = await db.query('SELECT * FROM users');
    return users;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
}

// Modelo para obtener un usuario por email
async function findByEmail(email) {
  try {
    const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return user[0]; // Retorna el primer usuario encontrado
  } catch (error) {
    console.error('Error al buscar usuario por email:', error);
    throw error;
  }
}

// Modelo para crear un nuevo usuario
async function create(name, email, password, role) {
  try {
    if (!password || password.trim() === '') {
      throw new Error('La contraseña no puede estar vacía');
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Encriptar la contraseña
    const query = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    await db.query(query, [name, email, hashedPassword, role]);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
}

// Modelo para actualizar un usuario
async function update(id, name, email, password = null, role) {
  try {
    // Verificar si el usuario existe
    const [existingUser] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    if (!existingUser) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar que el rol no esté vacío
    if (!role || role.trim() === '') {
      throw new Error('El rol no puede ser vacío');
    }

    // Armar la consulta de actualización
    let query = 'UPDATE users SET name = ?, email = ?, role = ?';
    const params = [name, email, role];

    // Si la contraseña se proporciona, se actualiza
    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ', password = ?';
      params.push(hashedPassword);
    }

    query += ' WHERE id = ?';
    params.push(id);

    // Ejecutar la consulta de actualización
    await db.query(query, params);

    return { message: 'Usuario actualizado correctamente' };
  } catch (error) {
    console.error('Error en la actualización:', error);
    throw error;
  }
}


// Modelo para eliminar un usuario
async function deleteUser(id) {
  try {
    const query = 'DELETE FROM users WHERE id = ?';
    await db.query(query, [id]);
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    throw error;
  }
}

module.exports = {
  getAll,
  create,
  update,
  deleteUser,
  findByEmail  // Aquí añadimos la función findByEmail
};
