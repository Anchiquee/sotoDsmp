const bcrypt = require('bcryptjs');
const db = require('./config/db'); // ajusta si tu ruta es distinta

(async () => {
  const hashed = await bcrypt.hash('123456', 10);
  await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
    'Admin',
    'admin1@example.com',
    hashed
  ]);
  console.log('Usuario creado');
})();


//$2b$10$MJCBS.CdE2OzUnmqRb2hX.RZICIpLWR60PqNHTyNuI665NbaOJ0ve