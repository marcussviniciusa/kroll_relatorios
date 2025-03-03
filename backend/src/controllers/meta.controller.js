const axios = require('axios');
const { validationResult } = require('express-validator');
const AppError = require('../utils/appError');
const tokenManager = require('../utils/tokenManager');
const metaTokenService = require('../services/metaToken.service');
const metaIntegrationService = require('../services/metaIntegration.service');

/**
 * Controlador para gerenciar integrações com o Meta (Facebook)
 */
class MetaController {
  /**
   * Conectar uma conta do Meta a uma empresa
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} res - Objeto de resposta Express
   * @param {Function} next - Função next do Express
   */
  async connectAccount(req, res, next) {
    try {
      // Validar entrada
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new AppError('Dados de entrada inválidos', 400, errors.array()));
      }

      const { companyId, accessToken, name } = req.body;

      // Verificar se o token é válido fazendo uma chamada para a API do Facebook
      try {
        const response = await axios.get(`https://graph.facebook.com/v18.0/me?access_token=${accessToken}`);
        const userId = response.data.id;
        
        // Criar a integração usando o serviço
        const integration = await metaIntegrationService.createIntegration({
          companyId,
          name,
          accountId: userId,
          accessToken
        });
        
        res.status(201).json({
          success: true,
          message: 'Integração com o Meta conectada com sucesso',
          integration: {
            id: integration.id,
            companyId: integration.companyId,
            name: integration.name,
            accountId: integration.accountId,
            isActive: integration.isActive,
            createdAt: integration.createdAt,
            lastSyncedAt: integration.lastSyncedAt,
            tokenStatus: integration.tokenStatus
          }
        });
      } catch (error) {
        console.error('Erro ao verificar token do Facebook:', error.response?.data || error.message);
        return next(new AppError('Token de acesso do Facebook inválido', 400));
      }
    } catch (error) {
      return next(new AppError('Erro ao conectar conta do Meta', 500));
    }
  }

  /**
   * Desconectar uma integração do Meta
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} res - Objeto de resposta Express
   * @param {Function} next - Função next do Express
   */
  async disconnect(req, res, next) {
    try {
      const { id } = req.params;
      
      // Remover a integração usando o serviço
      await metaIntegrationService.removeIntegration(id);
      
      res.status(200).json({
        success: true,
        message: 'Integração com o Meta desconectada com sucesso'
      });
    } catch (error) {
      if (error instanceof AppError) {
        return next(error);
      }
      return next(new AppError('Erro ao desconectar conta do Meta', 500));
    }
  }

  /**
   * Obter integrações de uma empresa
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} res - Objeto de resposta Express
   * @param {Function} next - Função next do Express
   */
  async getCompanyIntegrations(req, res, next) {
    try {
      const { companyId } = req.params;
      
      // Obter integrações usando o serviço
      const integrations = await metaIntegrationService.getCompanyIntegrations(companyId);
      
      res.status(200).json({
        success: true,
        integrations
      });
    } catch (error) {
      if (error instanceof AppError) {
        return next(error);
      }
      return next(new AppError('Erro ao obter integrações da empresa', 500));
    }
  }

  /**
   * Obter uma integração pelo ID
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} res - Objeto de resposta Express
   * @param {Function} next - Função next do Express
   */
  async getIntegrationById(req, res, next) {
    try {
      const { id } = req.params;
      
      // Obter integração usando o serviço
      const integration = await metaIntegrationService.getIntegrationById(id);
      
      res.status(200).json({
        success: true,
        integration
      });
    } catch (error) {
      if (error instanceof AppError) {
        return next(error);
      }
      return next(new AppError('Erro ao obter integração', 500));
    }
  }

  /**
   * Obter métricas de uma integração
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} res - Objeto de resposta Express
   * @param {Function} next - Função next do Express
   */
  async getMetrics(req, res, next) {
    try {
      const { id } = req.params;
      const { period, metrics } = req.query;

      // Em uma implementação real, aqui você faria uma chamada para a API do Facebook
      // para buscar as métricas solicitadas
      // Por enquanto, vamos simular dados de exemplo
      
      // Gerar dados de exemplo para os últimos 7 dias
      const today = new Date();
      const metricsData = [];
      
      // Lista de métricas disponíveis
      const availableMetrics = metrics ? metrics.split(',') : ['page_impressions', 'page_engagement'];
      
      // Gerar dados para cada métrica
      availableMetrics.forEach(metricName => {
        // Gerar dados para os últimos 7 dias
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          
          // Formatar data como YYYY-MM-DD
          const formattedDate = date.toISOString().split('T')[0];
          
          // Gerar um valor aleatório para a métrica
          let baseValue;
          if (metricName === 'page_impressions') {
            baseValue = 1000 + Math.floor(Math.random() * 500);
          } else if (metricName === 'page_engagement') {
            baseValue = 200 + Math.floor(Math.random() * 100);
          } else if (metricName === 'page_fans') {
            baseValue = 5000 + Math.floor(Math.random() * 50);
          } else {
            baseValue = 100 + Math.floor(Math.random() * 100);
          }
          
          metricsData.push({
            name: metricName,
            value: baseValue,
            date: formattedDate
          });
        }
      });
      
      res.status(200).json({
        metrics: metricsData
      });
    } catch (error) {
      return next(new AppError('Erro ao obter métricas da integração', 500));
    }
  }

  /**
   * Obter contas de anúncios disponíveis para uma integração
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} res - Objeto de resposta Express
   * @param {Function} next - Função next do Express
   */
  async getAdAccounts(req, res, next) {
    try {
      const { id } = req.params;

      // Em uma implementação real, aqui você faria uma chamada para a API do Facebook
      // para buscar as contas de anúncios disponíveis
      // Por enquanto, vamos simular dados de exemplo
      
      res.status(200).json([
        {
          id: 'act_123456789',
          name: 'Conta de Anúncios Principal',
          currency: 'BRL',
          status: 'ACTIVE'
        },
        {
          id: 'act_987654321',
          name: 'Conta de Anúncios Secundária',
          currency: 'BRL',
          status: 'ACTIVE'
        }
      ]);
    } catch (error) {
      return next(new AppError('Erro ao obter contas de anúncios', 500));
    }
  }

  /**
   * Obter métricas de uma conta de anúncios
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} res - Objeto de resposta Express
   * @param {Function} next - Função next do Express
   */
  async getAdAccountMetrics(req, res, next) {
    try {
      const { integrationId, adAccountId, startDate, endDate } = req.params;
      
      // Verificar se a integração existe
      await metaIntegrationService.getIntegrationById(integrationId);
      
      // Obter o token de acesso armazenado
      try {
        const tokenData = await metaTokenService.getToken(integrationId);
        
        // Usar o token para fazer a chamada para a API do Facebook
        // Em uma implementação real, você faria uma chamada para a API do Facebook
        // usando o token obtido
        
        // Por enquanto, vamos simular uma resposta bem-sucedida
        res.status(200).json({
          success: true,
          metrics: {
            impressions: 125000,
            clicks: 3200,
            ctr: 0.0256,
            spend: 1250.75,
            cpc: 0.39,
            conversions: 48
          }
        });
      } catch (error) {
        // Se o erro for relacionado ao token, retornar um erro específico
        if (error.statusCode === 401 || error.statusCode === 404) {
          return next(new AppError('Token de acesso inválido ou expirado', 401));
        }
        throw error;
      }
    } catch (error) {
      if (error instanceof AppError) {
        return next(error);
      }
      return next(new AppError('Erro ao obter métricas da conta de anúncios', 500));
    }
  }

  /**
   * Verificar o status de uma integração e seu token
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} res - Objeto de resposta Express
   * @param {Function} next - Função next do Express
   */
  async checkIntegrationStatus(req, res, next) {
    try {
      const { id } = req.params;
      
      // Verificar o status da integração usando o serviço
      const status = await metaIntegrationService.checkIntegrationStatus(id);
      
      // Retornar o status da integração
      res.status(200).json({
        success: true,
        integration: status
      });
    } catch (error) {
      if (error instanceof AppError) {
        return next(error);
      }
      return next(new AppError('Erro ao verificar status da integração', 500));
    }
  }

  /**
   * Verificar o status do token de uma integração
   * @param {Object} req - Objeto de requisição Express
   * @param {Object} res - Objeto de resposta Express
   * @param {Function} next - Função next do Express
   */
  async getTokenStatus(req, res, next) {
    try {
      const { id } = req.params;
      
      // Obter a integração
      const integration = await metaIntegrationService.getIntegrationById(id);
      
      if (!integration) {
        return next(new AppError('Integração não encontrada', 404));
      }
      
      try {
        // Verificar o status do token
        const tokenStatus = await metaTokenService.verifyToken(id);
        
        // Combinar informações da integração com o status do token
        const result = {
          id: integration.id,
          name: integration.name,
          accountId: integration.accountId,
          isActive: integration.isActive,
          lastSyncedAt: integration.lastSyncedAt,
          tokenStatus: tokenStatus.status,
          tokenExpiresAt: tokenStatus.expiresAt,
          scopes: tokenStatus.scopes
        };
        
        res.status(200).json({
          success: true,
          integration: result
        });
      } catch (error) {
        // Se o token não for encontrado ou estiver inválido, retornar status apropriado
        const result = {
          id: integration.id,
          name: integration.name,
          accountId: integration.accountId,
          isActive: false,
          lastSyncedAt: integration.lastSyncedAt,
          tokenStatus: error.statusCode === 404 ? 'not_found' : 'invalid',
          tokenExpiresAt: null,
          scopes: []
        };
        
        res.status(200).json({
          success: true,
          integration: result
        });
      }
    } catch (error) {
      if (error instanceof AppError) {
        return next(error);
      }
      return next(new AppError('Erro ao verificar status do token', 500));
    }
  }
}

module.exports = new MetaController();
