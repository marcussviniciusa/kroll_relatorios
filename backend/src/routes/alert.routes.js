const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth');

// Placeholder for controller (to be implemented properly)
const alertController = {
  createAlert: (req, res) => {
    res.status(201).json({ 
      message: 'Alert created successfully',
      alert: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: req.body.name,
        description: req.body.description,
        companyId: req.body.companyId,
        metric: req.body.metric,
        condition: req.body.condition,
        threshold: req.body.threshold,
        frequency: req.body.frequency || 'daily',
        recipients: req.body.recipients || [],
        active: true,
        createdBy: req.user.id,
        createdAt: new Date()
      }
    });
  },
  getAllAlerts: (req, res) => {
    res.status(200).json({ 
      alerts: [
        { 
          id: '123e4567-e89b-12d3-a456-426614174000', 
          name: 'Low Engagement Alert', 
          description: 'Alert when engagement drops below threshold',
          companyId: 'comp-123',
          metric: 'page_engagement',
          condition: 'less_than',
          threshold: 100,
          frequency: 'daily',
          recipients: ['admin@example.com'],
          active: true,
          createdAt: new Date()
        },
        { 
          id: '123e4567-e89b-12d3-a456-426614174001', 
          name: 'High Traffic Alert', 
          description: 'Alert when traffic exceeds threshold',
          companyId: 'comp-123',
          metric: 'sessions',
          condition: 'greater_than',
          threshold: 5000,
          frequency: 'hourly',
          recipients: ['admin@example.com', 'manager@example.com'],
          active: true,
          createdAt: new Date()
        }
      ]
    });
  },
  getAlertById: (req, res) => {
    res.status(200).json({ 
      alert: { 
        id: req.params.id, 
        name: 'Low Engagement Alert', 
        description: 'Alert when engagement drops below threshold',
        companyId: 'comp-123',
        metric: 'page_engagement',
        condition: 'less_than',
        threshold: 100,
        frequency: 'daily',
        recipients: ['admin@example.com'],
        active: true,
        createdBy: 'user-123',
        lastTriggeredAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
  },
  updateAlert: (req, res) => {
    res.status(200).json({ 
      message: 'Alert updated successfully',
      alert: {
        id: req.params.id,
        ...req.body,
        updatedAt: new Date()
      }
    });
  },
  deleteAlert: (req, res) => {
    res.status(200).json({ message: 'Alert deleted successfully' });
  },
  toggleAlertStatus: (req, res) => {
    const active = req.body.active;
    res.status(200).json({ 
      message: `Alert ${active ? 'activated' : 'deactivated'} successfully`,
      alert: {
        id: req.params.id,
        active: active,
        updatedAt: new Date()
      }
    });
  }
};

// Alert routes
router.post(
  '/',
  [
    authMiddleware,
    body('name').notEmpty().withMessage('Alert name is required'),
    body('companyId').notEmpty().withMessage('Company ID is required'),
    body('metric').notEmpty().withMessage('Metric is required'),
    body('condition').isIn(['greater_than', 'less_than', 'equal_to']).withMessage('Invalid condition'),
    body('threshold').isNumeric().withMessage('Threshold must be a number'),
    body('frequency').optional().isIn(['hourly', 'daily', 'weekly']).withMessage('Invalid frequency'),
    body('recipients').optional().isArray().withMessage('Recipients must be an array'),
    body('recipients.*').optional().isEmail().withMessage('Recipients must be valid emails')
  ],
  alertController.createAlert
);

router.get('/', authMiddleware, alertController.getAllAlerts);
router.get('/:id', authMiddleware, alertController.getAlertById);

router.put(
  '/:id',
  [
    authMiddleware,
    body('name').optional().notEmpty().withMessage('Alert name cannot be empty'),
    body('condition').optional().isIn(['greater_than', 'less_than', 'equal_to']).withMessage('Invalid condition'),
    body('threshold').optional().isNumeric().withMessage('Threshold must be a number'),
    body('frequency').optional().isIn(['hourly', 'daily', 'weekly']).withMessage('Invalid frequency'),
    body('recipients').optional().isArray().withMessage('Recipients must be an array'),
    body('recipients.*').optional().isEmail().withMessage('Recipients must be valid emails')
  ],
  alertController.updateAlert
);

router.delete('/:id', authMiddleware, alertController.deleteAlert);

router.patch(
  '/:id/status',
  [
    authMiddleware,
    body('active').isBoolean().withMessage('Active must be a boolean')
  ],
  alertController.toggleAlertStatus
);

module.exports = router;
