// models/Report.js
const db = require('../config/db');

module.exports = {
  async findById(id) {
    const [rows] = await db.query('SELECT * FROM reports WHERE id = ?', [id]);
    return rows[0];
  },
  
  async create(report) {
    const { title, description, db_host, db_port, db_user, db_password, db_name, db_query } = report;
    await db.query('INSERT INTO reports (title, description, db_host, db_port, db_user, db_password, db_name, db_query) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [title, description, db_host, db_port, db_user, db_password, db_name, db_query]);
  },

  async update(id, report) {
    const { title, description, db_host, db_port, db_user, db_password, db_name, db_query } = report;
    await db.query('UPDATE reports SET title = ?, description = ?, db_host = ?, db_port = ?, db_user = ?, db_password = ?, db_name = ?, db_query = ? WHERE id = ?', 
    [title, description, db_host, db_port, db_user, db_password, db_name, db_query, id]);
  },

  // Método para eliminar un reporte
  async delete(id) {
    const [result] = await db.query('DELETE FROM reports WHERE id = ?', [id]);
    return result.affectedRows > 0; // Devuelve `true` si el reporte fue eliminado
  },

  async count() {
    const [rows] = await db.query('SELECT COUNT(*) AS total FROM reports');
    return rows[0].total;
  },

  async findAll() {
    const [rows] = await db.query('SELECT * FROM reports');
    return rows;
  },
   // ✅ Método para marcar el reporte como enviado
   async markAsSent(id) {
    await db.query('UPDATE reports SET enviado = 1 WHERE id = ?', [id]);
  }
};
