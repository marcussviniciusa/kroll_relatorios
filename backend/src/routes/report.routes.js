const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth');

// Placeholder for controller (to be implemented properly)
const reportController = {
  createReport: (req, res) => {
    res.status(201).json({ 
      message: 'Report created successfully',
      report: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: req.body.name,
        description: req.body.description,
        companyId: req.body.companyId,
        dashboardId: req.body.dashboardId,
        format: req.body.format || 'pdf',
        status: 'draft',
        createdBy: req.user.id,
        createdAt: new Date()
      }
    });
  },
  getAllReports: (req, res) => {
    res.status(200).json({ 
      reports: [
        { 
          id: '123e4567-e89b-12d3-a456-426614174000', 
          name: 'Monthly Performance Report', 
          description: 'Overview of monthly performance metrics',
          companyId: 'comp-123',
          dashboardId: 'dash-123',
          format: 'pdf',
          status: 'published',
          createdAt: new Date()
        },
        { 
          id: '123e4567-e89b-12d3-a456-426614174001', 
          name: 'Campaign Analysis', 
          description: 'Detailed analysis of recent marketing campaigns',
          companyId: 'comp-123',
          dashboardId: 'dash-456',
          format: 'excel',
          status: 'draft',
          createdAt: new Date()
        }
      ]
    });
  },
  getReportById: (req, res) => {
    res.status(200).json({ 
      report: { 
        id: req.params.id, 
        name: 'Monthly Performance Report', 
        description: 'Overview of monthly performance metrics',
        companyId: 'comp-123',
        dashboardId: 'dash-123',
        format: 'pdf',
        status: 'published',
        createdBy: 'user-123',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
  },
  updateReport: (req, res) => {
    res.status(200).json({ 
      message: 'Report updated successfully',
      report: {
        id: req.params.id,
        ...req.body,
        updatedAt: new Date()
      }
    });
  },
  deleteReport: (req, res) => {
    res.status(200).json({ message: 'Report deleted successfully' });
  },
  generateReport: (req, res) => {
    res.status(200).json({ 
      message: 'Report generated successfully',
      reportUrl: 'https://example.com/reports/generated-report.pdf'
    });
  },
  scheduleReport: (req, res) => {
    res.status(200).json({ 
      message: 'Report scheduled successfully',
      schedule: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        reportId: req.params.id,
        frequency: req.body.frequency,
        dayOfWeek: req.body.dayOfWeek,
        dayOfMonth: req.body.dayOfMonth,
        time: req.body.time,
        recipients: req.body.recipients,
        active: true,
        nextRunAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000) // tomorrow
      }
    });
  }
};

// Report routes
router.post(
  '/',
  [
    authMiddleware,
    body('name').notEmpty().withMessage('Report name is required'),
    body('companyId').notEmpty().withMessage('Company ID is required'),
    body('format').optional().isIn(['pdf', 'excel', 'csv']).withMessage('Invalid format')
  ],
  reportController.createReport
);

router.get('/', authMiddleware, reportController.getAllReports);
router.get('/:id', authMiddleware, reportController.getReportById);

router.put(
  '/:id',
  [
    authMiddleware,
    body('name').optional().notEmpty().withMessage('Report name cannot be empty'),
    body('format').optional().isIn(['pdf', 'excel', 'csv']).withMessage('Invalid format')
  ],
  reportController.updateReport
);

router.delete('/:id', authMiddleware, reportController.deleteReport);

router.post(
  '/:id/generate',
  [
    authMiddleware,
    body('startDate').optional().isISO8601().withMessage('Invalid start date format'),
    body('endDate').optional().isISO8601().withMessage('Invalid end date format')
  ],
  reportController.generateReport
);

router.post(
  '/:id/schedule',
  [
    authMiddleware,
    body('frequency').isIn(['daily', 'weekly', 'monthly']).withMessage('Invalid frequency'),
    body('dayOfWeek').optional().isInt({ min: 0, max: 6 }).withMessage('Day of week must be between 0-6'),
    body('dayOfMonth').optional().isInt({ min: 1, max: 31 }).withMessage('Day of month must be between 1-31'),
    body('time').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Time must be in HH:MM format'),
    body('recipients').isArray().withMessage('Recipients must be an array'),
    body('recipients.*').isEmail().withMessage('Recipients must be valid emails')
  ],
  reportController.scheduleReport
);

module.exports = router;
