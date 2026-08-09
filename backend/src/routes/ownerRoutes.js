const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');
const { verifyToken, restrictTo } = require('../middlewares/authMiddleware');

router.get(
  '/dashboard',
  verifyToken,
  restrictTo('Store Owner'), 
  ownerController.getDashboard
);

module.exports = router;