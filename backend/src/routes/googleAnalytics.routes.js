const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth');

// Placeholder for controller (to be implemented properly)
const gaController = {
  connect: (req, res) => {
    res.status(200).json({ 
      message: 'Google Analytics account connected successfully',
      integration: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        companyId: req.body.companyId,
        name: req.body.name,
        propertyId: req.body.propertyId,
        viewId: req.body.viewId,
        isActive: true,
        createdAt: new Date()
      }
    });
  },
  disconnect: (req, res) => {
    res.status(200).json({ message: 'Google Analytics account disconnected successfully' });
  },
  getAllIntegrations: (req, res) => {
    res.status(200).json({ 
      integrations: [
        { 
          id: '123e4567-e89b-12d3-a456-426614174000', 
          companyId: 'comp-123',
          name: 'Primary GA Account', 
          propertyId: 'UA-12345678-1',
          viewId: '123456789',
          isActive: true,
          createdAt: new Date()
        },
        { 
          id: '123e4567-e89b-12d3-a456-426614174001', 
          companyId: 'comp-123',
          name: 'Secondary GA Account', 
          propertyId: 'UA-87654321-1',
          viewId: '987654321',
          isActive: false,
          createdAt: new Date()
        }
      ]
    });
  },
  getIntegrationById: (req, res) => {
    res.status(200).json({ 
      integration: { 
        id: req.params.id, 
        companyId: 'comp-123',
        name: 'Primary GA Account', 
        propertyId: 'UA-12345678-1',
        viewId: '123456789',
        isActive: true,
        createdAt: new Date(),
        lastSyncedAt: new Date()
      }
    });
  },
  getMetrics: (req, res) => {
    res.status(200).json({ 
      metrics: [
        { name: 'pageviews', value: 5250, date: '2023-01-01' },
        { name: 'pageviews', value: 4980, date: '2023-01-02' },
        { name: 'pageviews', value: 5320, date: '2023-01-03' },
        { name: 'sessions', value: 1320, date: '2023-01-01' },
        { name: 'sessions', value: 1175, date: '2023-01-02' },
        { name: 'sessions', value: 1290, date: '2023-01-03' },
        { name: 'users', value: 980, date: '2023-01-01' },
        { name: 'users', value: 875, date: '2023-01-02' },
        { name: 'users', value: 1020, date: '2023-01-03' }
      ]
    });
  }
};

// Google Analytics integration routes
router.post(
  '/connect',
  [
    authMiddleware,
    body('companyId').notEmpty().withMessage('Company ID is required'),
    body('name').notEmpty().withMessage('Integration name is required'),
    body('propertyId').notEmpty().withMessage('Property ID is required'),
    body('accessToken').notEmpty().withMessage('Access token is required')
  ],
  gaController.connect
);

router.delete('/:id', authMiddleware, gaController.disconnect);
router.get('/', authMiddleware, gaController.getAllIntegrations);
router.get('/:id', authMiddleware, gaController.getIntegrationById);
router.get(
  '/:id/metrics',
  [
    authMiddleware,
    body('startDate').optional().isDate().withMessage('Invalid start date'),
    body('endDate').optional().isDate().withMessage('Invalid end date'),
    body('metrics').optional().isArray().withMessage('Metrics must be an array')
  ],
  gaController.getMetrics
);

module.exports = router;
