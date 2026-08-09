const express = require('express');
const router = express.Router();
const { createStore, getAllStores, getStoresForNormalUser } = require('../controllers/storeController');
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

module.exports = router;