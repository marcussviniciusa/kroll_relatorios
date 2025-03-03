const { body } = require('express-validator');

const createCompanyValidator = [
  body('name')
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2 and 100 characters'),
  body('industry')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Industry must be less than 50 characters'),
  body('website')
    .optional()
    .isURL()
    .withMessage('Website must be a valid URL'),
  body('address')
    .optional()
    .isObject()
    .withMessage('Address must be an object'),
  body('address.street')
    .optional()
    .isString()
    .withMessage('Street must be a string'),
  body('address.city')
    .optional()
    .isString()
    .withMessage('City must be a string'),
  body('address.state')
    .optional()
    .isString()
    .withMessage('State must be a string'),
  body('address.zipCode')
    .optional()
    .isString()
    .withMessage('ZIP code must be a string'),
  body('address.country')
    .optional()
    .isString()
    .withMessage('Country must be a string'),
  body('logo')
    .optional()
    .isURL()
    .withMessage('Logo must be a valid URL'),
  body('settings')
    .optional()
    .isObject()
    .withMessage('Settings must be an object')
];

const updateCompanyValidator = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2 and 100 characters'),
  body('industry')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Industry must be less than 50 characters'),
  body('website')
    .optional()
    .isURL()
    .withMessage('Website must be a valid URL'),
  body('address')
    .optional()
    .isObject()
    .withMessage('Address must be an object'),
  body('address.street')
    .optional()
    .isString()
    .withMessage('Street must be a string'),
  body('address.city')
    .optional()
    .isString()
    .withMessage('City must be a string'),
  body('address.state')
    .optional()
    .isString()
    .withMessage('State must be a string'),
  body('address.zipCode')
    .optional()
    .isString()
    .withMessage('ZIP code must be a string'),
  body('address.country')
    .optional()
    .isString()
    .withMessage('Country must be a string'),
  body('logo')
    .optional()
    .isURL()
    .withMessage('Logo must be a valid URL'),
  body('settings')
    .optional()
    .isObject()
    .withMessage('Settings must be an object')
];

module.exports = {
  createCompanyValidator,
  updateCompanyValidator
};
