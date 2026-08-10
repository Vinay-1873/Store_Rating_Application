const express = require('express');
const router = express.Router();
const { createStore, getAllStores, getStoresForNormalUser, getTopStores } = require('../controllers/storeController');
const { createStoreValidation, validate } = require('../middlewares/validators');
const { verifyToken, restrictTo } = require('../middlewares/authMiddleware');

router.post(
  '/',
  verifyToken,
  restrictTo('System Administrator'),
  createStoreValidation,
  validate,
  createStore
);

router.get(
  '/', 
  verifyToken, 
  restrictTo('System Administrator'), 
  getAllStores
);

router.get(
  '/explore',
  verifyToken,
  restrictTo('Normal User'),
  getStoresForNormalUser
);

// Public endpoint for top stores (used by landing page)
router.get('/top', getTopStores);

module.exports = router;