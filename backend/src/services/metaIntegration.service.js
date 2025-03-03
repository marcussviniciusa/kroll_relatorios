const { v4: uuidv4 } = require('uuid');
const { MetaIntegration } = require('../models');
const metaTokenService = require('./metaToken.service');
const AppError = require('../utils/appError');

/**
 * Serviço para gerenciar integrações com o Meta (Facebook)
 */
class MetaIntegrationService {
  /**
   * Criar uma nova integração com o Meta
   * @param {Object} data - Dados da integração
   * @param {string} data.companyId - ID da empresa
   * @param {string} data.name - Nome da integração
   * @param {string} data.accountId - ID da conta do Facebook
   * @param {string} data.accessToken - Token de acesso do Facebook
   * @returns {Promise<Object>} - Integração criada
   */
  async createIntegration(data) {
    try {
      const { companyId, name, accountId, accessToken } = data;
      
      // Gerar ID único para a integração
      const id = uuidv4();
      
      // Criar a integração no banco de dados
      const integration = await MetaIntegration.create({
        id,
        companyId,
        name,
        accountId,
        isActive: true,
        tokenStatus: 'active',
        tokenLastVerifiedAt: new Date(),
        lastSyncedAt: new Date()
      });
      
      // Armazenar o token de forma segura
      await metaTokenService.storeToken(id, accessToken, {
        userId: accountId,
        companyId
      });
      
      return integration;
    } catch (error) {
      console.error('Erro ao criar integração com o Meta:', error);
      throw new AppError('Falha ao criar integração com o Meta', 500);
    }
  }
  
  /**
   * Obter uma integração pelo ID
   * @param {string} id - ID da integração
   * @returns {Promise<Object>} - Integração encontrada
   */
  async getIntegrationById(id) {
    try {
      const integration = await MetaIntegration.findByPk(id);
      
      if (!integration) {
        throw new AppError('Integração não encontrada', 404);
      }
      
      return integration;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Erro ao obter integração:', error);
      throw new AppError('Falha ao obter integração', 500);
    }
  }
  
  /**
   * Obter integrações de uma empresa
   * @param {string} companyId - ID da empresa
   * @returns {Promise<Array>} - Lista de integrações
   */
  async getCompanyIntegrations(companyId) {
    try {
      const integrations = await MetaIntegration.findAll({
        where: { companyId }
      });
      
      return integrations;
    } catch (error) {
      console.error('Erro ao obter integrações da empresa:', error);
      throw new AppError('Falha ao obter integrações da empresa', 500);
    }
  }
  
  /**
   * Atualizar uma integração
   * @param {string} id - ID da integração
   * @param {Object} data - Dados a serem atualizados
   * @returns {Promise<Object>} - Integração atualizada
   */
  async updateIntegration(id, data) {
    try {
      const integration = await this.getIntegrationById(id);
      
      // Atualizar os campos permitidos
      if (data.name) integration.name = data.name;
      if (data.isActive !== undefined) integration.isActive = data.isActive;
      
      // Se um novo token for fornecido, atualizá-lo
      if (data.accessToken) {
        await metaTokenService.storeToken(id, data.accessToken, {
          userId: integration.accountId,
          companyId: integration.companyId
        });
        
        integration.tokenStatus = 'active';
        integration.tokenLastVerifiedAt = new Date();
      }
      
      await integration.save();
      
      return integration;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Erro ao atualizar integração:', error);
      throw new AppError('Falha ao atualizar integração', 500);
    }
  }
  
  /**
   * Remover uma integração
   * @param {string} id - ID da integração
   * @returns {Promise<boolean>} - True se a integração foi removida com sucesso
   */
  async removeIntegration(id) {
    try {
      const integration = await this.getIntegrationById(id);
      
      // Remover o token associado
      await metaTokenService.removeToken(id);
      
      // Remover a integração
      await integration.destroy();
      
      return true;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Erro ao remover integração:', error);
      throw new AppError('Falha ao remover integração', 500);
    }
  }
  
  /**
   * Verificar o status de uma integração
   * @param {string} id - ID da integração
   * @returns {Promise<Object>} - Status da integração
   */
  async checkIntegrationStatus(id) {
    try {
      const integration = await this.getIntegrationById(id);
      
      // Verificar o token
      try {
        const tokenStatus = await metaTokenService.verifyToken(id);
        
        // Atualizar o status do token na integração
        integration.tokenStatus = tokenStatus.isValid ? 'active' : 'invalid';
        integration.tokenLastVerifiedAt = new Date();
        await integration.save();
        
        return {
          id,
          isActive: integration.isActive,
          tokenStatus: integration.tokenStatus,
          tokenExpiresAt: tokenStatus.expiresAt,
          scopes: tokenStatus.scopes
        };
      } catch (error) {
        // Se o erro for relacionado ao token, atualizar o status
        if (error.statusCode === 401) {
          integration.tokenStatus = 'expired';
          integration.tokenLastVerifiedAt = new Date();
          await integration.save();
          
          return {
            id,
            isActive: integration.isActive,
            tokenStatus: 'expired',
            message: 'Token de acesso expirado'
          };
        } else if (error.statusCode === 404) {
          integration.tokenStatus = 'invalid';
          integration.tokenLastVerifiedAt = new Date();
          await integration.save();
          
          return {
            id,
            isActive: integration.isActive,
            tokenStatus: 'not_found',
            message: 'Token não encontrado'
          };
        }
        throw error;
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Erro ao verificar status da integração:', error);
      throw new AppError('Falha ao verificar status da integração', 500);
    }
  }
}

module.exports = new MetaIntegrationService();
