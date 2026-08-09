const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { submitRatingValidation, validate } = require('../middlewares/validators');
const { verifyToken, restrictTo } = require('../middlewares/authMiddleware');

router.post(
  '/',
  verifyToken,
  restrictTo('Normal User'), 
  submitRatingValidation,
  validate,
  ratingController.submitRating
);

module.exports = router;