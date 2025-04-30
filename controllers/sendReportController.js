// controllers/sendReportController.js
const mysql = require('mysql2/promise');
const EmailConfig = require('../models/EmailConfig');
const Report = require('../models/Report');
const Email = require('../models/Email');
const nodemailer = require('nodemailer');

exports.showReports = async (req, res) => {
  try {
    const reports = await Report.findAll();
    const sent = req.query.sent || '';
    const error = req.query.error || '';
    res.render('send_reports', { reports, sent, error });
  } catch (err) {
    console.error('Error al cargar reportes:', err);
    res.status(500).send('Error al cargar reportes.');
  }
};

exports.sendReports = async (req, res) => {
  try {
    const config = await EmailConfig.getEmailConfig();
    const reports = await Report.findAll();
    const emails = await Email.findAll();

    if (!config) return res.redirect('/dashboard/send_reports?error=1');
    if (!emails.length) return res.redirect('/dashboard/send_reports?error=1');

    const recipients = emails.map(e => e.address);

    const transporter = nodemailer.createTransport({
      host: config.smtpServer,
      port: config.smtpPort,
      secure: config.smtpPort == 465,
      auth: {
        user: config.emailAddress,
        pass: config.emailPassword
      },
      tls: { rejectUnauthorized: false },
    });

    for (const report of reports) {
      // Crear conexión dinámica para cada reporte
      const connection = await mysql.createConnection({
        host: report.db_host,
        port: report.db_port,
        user: report.db_user,
        password: report.db_password,
        database: report.db_name
      });

      const [rows] = await connection.execute(report.db_query);

      // Construir tabla HTML
      const tableHTML = generateHTMLTable(rows);

      // Enviar correo
      await transporter.sendMail({
        from: config.emailAddress,
        to: recipients.join(','),
        subject: `Reporte: ${report.title}`,
        html: `
          <h2>${report.title}</h2>
          <p>${report.description || 'Reporte generado automáticamente.'}</p>
          ${tableHTML}
        `
      });

      await connection.end();

      // Marcar el reporte como enviado
      await Report.markAsSent(report.id);
    }

    res.redirect('/dashboard/send_reports?sent=1');
  } catch (err) {
    console.error('Error al enviar reportes:', err);
    res.redirect('/dashboard/send_reports?error=1');
  }
};

// Función para construir tabla HTML
function generateHTMLTable(rows) {
  if (!rows.length) return '<p>No hay datos disponibles para este reporte.</p>';

  let headers = Object.keys(rows[0]);
  let table = '<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">';
  table += '<thead><tr>';
  headers.forEach(header => {
    table += `<th style="background-color: #f2f2f2;">${header}</th>`;
  });
  table += '</tr></thead><tbody>';

  rows.forEach(row => {
    table += '<tr>';
    headers.forEach(header => {
      table += `<td>${row[header]}</td>`;
    });
    table += '</tr>';
  });

  table += '</tbody></table>';
  return table;
}
