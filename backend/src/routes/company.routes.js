const express = require('express');
const companyController = require('../controllers/company.controller');
const authMiddleware = require('../middlewares/auth');
const { adminOnly, ownerOnly } = require('../middlewares/rbac');
const validate = require('../middlewares/validate');
const companyValidator = require('../validators/company.validator');

const router = express.Router();

/**
 * @route   GET /api/companies
 * @desc    Get all companies with pagination
 * @access  Admin
 */
router.get(
  '/',
  authMiddleware,
  adminOnly,
  companyController.getAllCompanies
);

/**
 * @route   GET /api/companies/:id
 * @desc    Get a company by ID
 * @access  Admin, Company Members
 */
router.get(
  '/:id',
  authMiddleware,
  companyController.getCompanyById
);

/**
 * @route   POST /api/companies
 * @desc    Create a new company
 * @access  Admin
 */
router.post(
  '/',
  authMiddleware,
  adminOnly,
  validate(companyValidator.createCompany),
  companyController.createCompany
);

/**
 * @route   PUT /api/companies/:id
 * @desc    Update a company
 * @access  Admin, Company Owner
 */
router.put(
  '/:id',
  authMiddleware,
  ownerOnly,
  validate(companyValidator.updateCompany),
  companyController.updateCompany
);

/**
 * @route   DELETE /api/companies/:id
 * @desc    Delete a company
 * @access  Admin
 */
router.delete(
  '/:id',
  authMiddleware,
  adminOnly,
  companyController.deleteCompany
);

/**
 * @route   POST /api/companies/user
 * @desc    Add a user to a company
 * @access  Admin, Company Owner
 */
router.post(
  '/user',
  authMiddleware,
  ownerOnly,
  validate(companyValidator.addUserToCompany),
  companyController.addUserToCompany
);

/**
 * @route   DELETE /api/companies/:companyId/user/:userId
 * @desc    Remove a user from a company
 * @access  Admin, Company Owner
 */
router.delete(
  '/:companyId/user/:userId',
  authMiddleware,
  ownerOnly,
  companyController.removeUserFromCompany
);

module.exports = router;
