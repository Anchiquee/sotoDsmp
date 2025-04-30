const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/users', userController.index);
router.post('/users/create', userController.create);
router.put('/users/update/:id', userController.update);  // Asegúrate de que la ruta sea POST
router.get('/users/delete/:id', userController.delete);

module.exports = router;
