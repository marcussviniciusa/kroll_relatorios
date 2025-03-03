const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth');

// Placeholder for controller (to be implemented properly)
const metaController = {
  connect: (req, res) => {
    res.status(200).json({ 
      message: 'Meta account connected successfully',
      integration: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        companyId: req.body.companyId,
        name: req.body.name,
        accountId: '12345678',
        isActive: true,
        createdAt: new Date()
      }
    });
  },
  disconnect: (req, res) => {
    res.status(200).json({ message: 'Meta account disconnected successfully' });
  },
  getAllIntegrations: (req, res) => {
    res.status(200).json({ 
      integrations: [
        { 
          id: '123e4567-e89b-12d3-a456-426614174000', 
          companyId: 'comp-123',
          name: 'Primary Facebook Account', 
          accountId: '12345678',
          isActive: true,
          createdAt: new Date()
        },
        { 
          id: '123e4567-e89b-12d3-a456-426614174001', 
          companyId: 'comp-123',
          name: 'Secondary Facebook Account', 
          accountId: '87654321',
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
        name: 'Primary Facebook Account', 
        accountId: '12345678',
        isActive: true,
        createdAt: new Date(),
        lastSyncedAt: new Date()
      }
    });
  },
  getMetrics: (req, res) => {
    res.status(200).json({ 
      metrics: [
        { name: 'page_impressions', value: 1250, date: '2023-01-01' },
        { name: 'page_impressions', value: 1480, date: '2023-01-02' },
        { name: 'page_impressions', value: 1320, date: '2023-01-03' },
        { name: 'page_engagement', value: 320, date: '2023-01-01' },
        { name: 'page_engagement', value: 375, date: '2023-01-02' },
        { name: 'page_engagement', value: 290, date: '2023-01-03' }
      ]
    });
  }
};

// Meta integration routes
router.post(
  '/connect',
  [
    authMiddleware,
    body('companyId').notEmpty().withMessage('Company ID is required'),
    body('name').notEmpty().withMessage('Integration name is required'),
    body('accessToken').notEmpty().withMessage('Access token is required')
  ],
  metaController.connect
);

router.delete('/:id', authMiddleware, metaController.disconnect);
router.get('/', authMiddleware, metaController.getAllIntegrations);
router.get('/:id', authMiddleware, metaController.getIntegrationById);
router.get(
  '/:id/metrics',
  [
    authMiddleware,
    body('startDate').optional().isDate().withMessage('Invalid start date'),
    body('endDate').optional().isDate().withMessage('Invalid end date'),
    body('metrics').optional().isArray().withMessage('Metrics must be an array')
  ],
  metaController.getMetrics
);

module.exports = router;
