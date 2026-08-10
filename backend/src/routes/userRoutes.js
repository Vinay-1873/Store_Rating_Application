const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, restrictTo } = require('../middlewares/authMiddleware');


router.get(
  '/stats', 
  verifyToken, 
  restrictTo('System Administrator'), 
  userController.getDashboardStats 
);

router.get(
  '/', 
  verifyToken, 
  restrictTo('System Administrator'), 
  userController.getAllUsers
);

module.exports = router;