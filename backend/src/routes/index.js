const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const companyRoutes = require('./company.routes');
const dashboardRoutes = require('./dashboard.routes');
const metaRoutes = require('./meta.routes');
const googleAnalyticsRoutes = require('./googleAnalytics.routes');
const reportRoutes = require('./report.routes');
const alertRoutes = require('./alert.routes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/companies', companyRoutes);
router.use('/dashboards', dashboardRoutes);
router.use('/meta', metaRoutes);
router.use('/integrations/ga', googleAnalyticsRoutes);
router.use('/reports', reportRoutes);
router.use('/alerts', alertRoutes);

module.exports = router;
