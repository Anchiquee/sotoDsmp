const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

router.get('/emails', emailController.index);
router.post('/emails/create', emailController.create);
router.get('/emails/delete/:id', emailController.delete);

module.exports = router;