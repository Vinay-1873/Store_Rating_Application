const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerValidation, validate } = require('../middlewares/validators');

router.post('/register', registerValidation, validate, authController.register);

module.exports = router;