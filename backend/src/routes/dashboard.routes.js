const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const widgetController = require('../controllers/widget.controller');
const { authenticate } = require('../middlewares/auth');
const { authorize } = require('../middlewares/rbac');
const validateRequest = require('../middlewares/validateRequest');
const dashboardValidator = require('../validators/dashboard.validator');
const widgetValidator = require('../validators/widget.validator');

/**
 * Dashboard Routes
 */

// Public dashboard routes
router.get('/public/:accessKey', dashboardController.getSharedDashboard);
router.post('/public/:accessKey/verify-password', dashboardController.verifySharedDashboardPassword);

// Protected dashboard routes
router.use(authenticate);

// Dashboard CRUD operations
router.get('/', dashboardController.getAllDashboards);
router.post('/', validateRequest(dashboardValidator.createDashboard), dashboardController.createDashboard);
router.get('/:id', dashboardController.getDashboardById);
router.put('/:id', validateRequest(dashboardValidator.updateDashboard), dashboardController.updateDashboard);
router.delete('/:id', dashboardController.deleteDashboard);

// Dashboard sharing
router.post('/:id/share', validateRequest(dashboardValidator.shareDashboard), dashboardController.shareDashboard);
router.delete('/:id/share', dashboardController.removeSharing);

// Dashboard duplication
router.post('/:id/duplicate', validateRequest(dashboardValidator.duplicateDashboard), dashboardController.duplicateDashboard);

// Dashboard categories and tags
router.get('/categories', dashboardController.getDashboardCategories);
router.get('/tags', dashboardController.getDashboardTags);

// Widget routes for a specific dashboard
router.get('/:dashboardId/widgets', widgetController.getWidgetsByDashboard);
router.post(
  '/:dashboardId/widgets', 
  validateRequest(widgetValidator.createWidget), 
  widgetController.createWidget
);
router.get('/:dashboardId/widgets/:widgetId', widgetController.getWidgetById);
router.put(
  '/:dashboardId/widgets/:widgetId', 
  validateRequest(widgetValidator.updateWidget), 
  widgetController.updateWidget
);
router.delete('/:dashboardId/widgets/:widgetId', widgetController.deleteWidget);

// Update widget positions (layout)
router.put(
  '/:dashboardId/layout', 
  validateRequest(dashboardValidator.updateLayout), 
  dashboardController.updateDashboardLayout
);

// Clone widget
router.post(
  '/:dashboardId/widgets/:widgetId/clone', 
  validateRequest(widgetValidator.cloneWidget), 
  widgetController.cloneWidget
);

// Dashboard data operations
router.get('/:id/data', dashboardController.getDashboardData);
router.post('/:id/refresh', dashboardController.refreshDashboardData);

// Dashboard template operations
router.get('/templates', authorize(['admin', 'manager']), dashboardController.getDashboardTemplates);
router.post(
  '/templates', 
  authorize(['admin']), 
  validateRequest(dashboardValidator.createDashboardTemplate), 
  dashboardController.createDashboardTemplate
);
router.post(
  '/:id/create-from-template', 
  validateRequest(dashboardValidator.createFromTemplate), 
  dashboardController.createDashboardFromTemplate
);

// Dashboard export
router.get('/:id/export', dashboardController.exportDashboard);
router.get('/:id/export/pdf', dashboardController.exportDashboardToPDF);
router.get('/:id/export/image', dashboardController.exportDashboardToImage);

module.exports = router;
