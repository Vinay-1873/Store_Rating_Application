const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerValidation, loginValidation,updatePasswordValidation, validate } = require('../middlewares/validators');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login); 

router.patch(
  '/update-password',
  verifyToken, 
  updatePasswordValidation,
  validate,
  authController.updatePassword
);

module.exports = router;