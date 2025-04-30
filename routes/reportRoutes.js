const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/reports', reportController.index);
router.post('/reports/create', reportController.create);
router.post('/reports/update/:id', reportController.update);
router.get('/reports/delete/:id', reportController.delete);

module.exports = router;