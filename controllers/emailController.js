const Email = require('../models/Email');

exports.index = async (req, res) => {
  const emails = await Email.findAll();
  const user = req.user;
  res.render('emails', { emails, user });
};

exports.create = async (req, res) => {
  const { address } = req.body;
  const userId = req.user.id;
  await Email.create(address, userId);
  res.redirect('/dashboard/emails');
};

exports.delete = async (req, res) => {
  await Email.delete(req.params.id);
  res.redirect('/dashboard/emails');
};
