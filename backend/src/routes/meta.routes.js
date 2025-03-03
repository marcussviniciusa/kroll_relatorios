const express = require('express');
const router = express.Router();
const metaController = require('../controllers/meta.controller');
const authMiddleware = require('../middlewares/auth');

/**
 * Meta (Facebook) Integration Routes
 */

// Rotas públicas para autenticação OAuth
router.get('/auth/url', metaController.getAuthUrl);
router.post('/auth/callback', metaController.handleAuthCallback);

// Rotas protegidas que requerem autenticação
router.use(authMiddleware);

// Gerenciamento de integrações
router.get('/integrations', metaController.getIntegrations);
router.get('/integrations/:id', metaController.getIntegrationById);
router.post('/connect', metaController.connectAccount);
router.delete('/integrations/:id', metaController.disconnectAccount);

// Status do token
router.get('/integrations/:id/status', metaController.getTokenStatus);

// Contas de anúncios
router.get('/integrations/:id/ad-accounts', metaController.getAdAccounts);
router.get('/integrations/:id/ad-accounts/:accountId/metrics', metaController.getAdAccountMetrics);

// Páginas
router.get('/integrations/:id/pages', metaController.getPages);
router.get('/integrations/:id/pages/:pageId/metrics', metaController.getPageMetrics);

// Instagram
router.get('/integrations/:id/instagram-accounts', metaController.getInstagramAccounts);
router.get('/integrations/:id/instagram-accounts/:accountId/metrics', metaController.getInstagramMetrics);

module.exports = router;
