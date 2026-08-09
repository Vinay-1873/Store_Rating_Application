const { body, validationResult } = require('express-validator');

const registerValidation = [
  body('name')
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters.'),
  body('email')
    .isEmail()
    .withMessage('Must follow standard email validation rules.'),
  body('address')
    .isLength({ max: 400 })
    .withMessage('Address cannot exceed 400 characters.'),
  body('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters.')
    .matches(/[A-Z]/)
    .withMessage('Password must include at least one uppercase letter.')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must include at least one special character.')
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address.'),
  body('password')
    .notEmpty()
    .withMessage('Password is required.')
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 'error', errors: errors.array() });
  }
  next();
};

const createStoreValidation = [
  body('name')
    .notEmpty().withMessage('Store name is required.')
    .isLength({ max: 60 }).withMessage('Store name cannot exceed 60 characters.'),
  body('email')
    .isEmail().withMessage('Must follow standard email validation rules.'),
  body('address')
    .notEmpty().withMessage('Address is required.')
    .isLength({ max: 400 }).withMessage('Address cannot exceed 400 characters.'),
  body('ownerId')
    .notEmpty().withMessage('An owner ID is required to create a store.')
];

const submitRatingValidation = [
  body('storeId')
    .notEmpty().withMessage('Store ID is required.'),
  body('value')
    .notEmpty().withMessage('Rating value is required.')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5.')
];

const updatePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required.'),
  body('newPassword')
    .isLength({ min: 8, max: 16 })
    .withMessage('New password must be between 8 and 16 characters.')
    .matches(/[A-Z]/)
    .withMessage('New password must include at least one uppercase letter.')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('New password must include at least one special character.')
];

module.exports = {
  registerValidation,
  loginValidation,
  createStoreValidation,
  submitRatingValidation,
  updatePasswordValidation,
  validate
};