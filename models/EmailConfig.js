// models/EmailConfig.js
const db = require('../config/db');  // Suponiendo que tu configuración de la base de datos está en 'db.js'

// Obtener la configuración actual
async function getEmailConfig() {
  const [rows] = await db.query('SELECT * FROM email_config LIMIT 1');
  if (rows.length === 0) {
    return {
      smtpServer: '',
      smtpPort: '',
      emailAddress: '',
      emailPassword: ''
    };
  }
  return rows[0];
}

// Guardar una nueva configuración
async function saveEmailConfig(smtpServer, emailAddress, emailPassword, smtpPort) {
  await db.query(
    'INSERT INTO email_config (smtpServer, emailAddress, emailPassword, smtpPort) VALUES (?, ?, ?, ?)',
    [smtpServer, emailAddress, emailPassword, smtpPort]
  );
}
// Actualizar configuración existente
async function updateEmailConfig(smtpServer, emailAddress, emailPassword, smtpPort) {
  await db.query(
    'UPDATE email_config SET smtpServer = ?, emailAddress = ?, emailPassword = ?, smtpPort = ? LIMIT 1',
    [smtpServer, emailAddress, emailPassword, smtpPort]
  );
}

// Eliminar la configuración
async function deleteEmailConfig() {
  const [result] = await db.query('DELETE FROM email_config LIMIT 1');
  console.log('Filas eliminadas:', result.affectedRows);
}



module.exports = {
  getEmailConfig,
  saveEmailConfig,
  updateEmailConfig,
  deleteEmailConfig
};