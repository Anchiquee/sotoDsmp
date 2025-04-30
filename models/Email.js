// models/Email.js
const db = require('../config/db');

module.exports = {
  async findAll() {
    const [rows] = await db.query('SELECT e.*, u.name AS created_by_name FROM emails e LEFT JOIN users u ON e.created_by = u.id');
    return rows;
  },

  async create(address, userId) {
    await db.query('INSERT INTO emails (address, created_by) VALUES (?, ?)', [address, userId]);
  },

  async delete(id) {
    await db.query('DELETE FROM emails WHERE id = ?', [id]);
  },

  async count() {
    const [rows] = await db.query('SELECT COUNT(*) as total FROM emails');
    return rows[0].total;
  },

  // 🔥 NUEVA FUNCIÓN: Solo correos destinatarios
  async findAllRecipients() {
    const [rows] = await db.query('SELECT address FROM emails');
    return rows.map(row => row.address);
  }
};
