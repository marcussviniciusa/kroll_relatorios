const axios = require('axios');
const MetaToken = require('../models/metaToken.model');
const tokenManager = require('../utils/tokenManager');
const AppError = require('../utils/appError');

/**
 * Serviço para gerenciar tokens de acesso do Meta (Facebook)
 */
class MetaTokenService {
  /**
   * Armazena um token de acesso do Meta de forma segura
   * @param {string} integrationId - ID da integração
   * @param {string} accessToken - Token de acesso do Meta
   * @param {Object} metadata - Metadados adicionais do token
   * @returns {Promise<Object>} Objeto com informações sobre o token armazenado
   */
  async storeToken(integrationId, accessToken, metadata = {}) {
    try {
      // Verificar se já existe um token para esta integração
      const existingToken = await MetaToken.findOne({ integrationId });
      
      // Preparar o token para armazenamento
      const tokenData = tokenManager.prepareTokenForStorage(accessToken);
      
      // Obter informações do token da API do Meta
      const tokenInfo = await this.getTokenInfo(accessToken);
      
      // Criar objeto de token
      const tokenObject = {
        integrationId,
        encryptedToken: tokenData.encryptedToken,
        iv: tokenData.iv,
        authTag: tokenData.authTag,
        tokenHash: tokenData.tokenHash,
        expiresAt: tokenInfo.expiresAt,
        metadata: {
          ...metadata,
          userId: tokenInfo.userId,
          scopes: tokenInfo.scopes,
          tokenType: tokenInfo.type || 'short_lived'
        },
        isActive: true,
        lastVerifiedAt: Date.now(),
        lastVerificationResult: {
          success: true,
          message: 'Token verificado durante armazenamento',
          timestamp: Date.now()
        }
      };
      
      // Atualizar token existente ou criar um novo
      if (existingToken) {
        Object.assign(existingToken, tokenObject);
        await existingToken.save();
        return { success: true, message: 'Token atualizado com sucesso', isNew: false };
      } else {
        const newToken = new MetaToken(tokenObject);
        await newToken.save();
        return { success: true, message: 'Token armazenado com sucesso', isNew: true };
      }
    } catch (error) {
      console.error('Erro ao armazenar token do Meta:', error);
      throw new AppError('Falha ao armazenar token de acesso', 500);
    }
  }
  
  /**
   * Recupera um token de acesso do Meta
   * @param {string} integrationId - ID da integração
   * @returns {Promise<Object>} Objeto com o token descriptografado e status
   */
  async getToken(integrationId) {
    try {
      // Buscar token no banco de dados
      const storedToken = await MetaToken.findOne({ 
        integrationId,
        isActive: true
      });
      
      if (!storedToken) {
        throw new AppError('Token não encontrado para esta integração', 404);
      }
      
      // Verificar se o token está expirado
      if (storedToken.isExpired()) {
        // Tentar renovar o token se possível
        try {
          const renewedToken = await this.renewToken(storedToken);
          return renewedToken;
        } catch (renewError) {
          // Se não for possível renovar, marcar como inativo
          await storedToken.deactivate();
          throw new AppError('Token expirado e não foi possível renová-lo', 401);
        }
      }
      
      // Descriptografar o token
      const tokenData = tokenManager.retrieveToken({
        encryptedToken: storedToken.encryptedToken,
        iv: storedToken.iv,
        authTag: storedToken.authTag,
        expiresAt: storedToken.expiresAt
      });
      
      if (!tokenData.isValid) {
        // Marcar token como inativo se não for válido
        await storedToken.deactivate();
        throw new AppError('Token inválido', 401);
      }
      
      return {
        token: tokenData.token,
        expiresAt: storedToken.expiresAt,
        metadata: storedToken.metadata,
        isValid: true
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Erro ao recuperar token do Meta:', error);
      throw new AppError('Falha ao recuperar token de acesso', 500);
    }
  }
  
  /**
   * Obtém informações sobre um token de acesso do Meta
   * @param {string} accessToken - Token de acesso do Meta
   * @returns {Promise<Object>} Informações sobre o token
   */
  async getTokenInfo(accessToken) {
    try {
      // Fazer chamada para a API de debug de token do Facebook
      const response = await axios.get(
        `https://graph.facebook.com/v18.0/debug_token?input_token=${accessToken}&access_token=${accessToken}`
      );
      
      const data = response.data.data;
      
      return {
        userId: data.user_id,
        appId: data.app_id,
        type: data.type,
        expiresAt: data.expires_at ? new Date(data.expires_at * 1000) : null,
        isValid: data.is_valid,
        scopes: data.scopes || []
      };
    } catch (error) {
      console.error('Erro ao obter informações do token:', error.response?.data || error.message);
      throw new AppError('Falha ao verificar token de acesso', 400);
    }
  }
  
  /**
   * Renova um token de acesso do Meta
   * @param {Object} storedToken - Token armazenado no banco de dados
   * @returns {Promise<Object>} Objeto com o novo token e status
   */
  async renewToken(storedToken) {
    try {
      // Descriptografar o token atual
      const tokenData = tokenManager.retrieveToken({
        encryptedToken: storedToken.encryptedToken,
        iv: storedToken.iv,
        authTag: storedToken.authTag
      });
      
      if (!tokenData.isValid) {
        throw new AppError('Token inválido para renovação', 401);
      }
      
      // Em uma implementação real, você usaria o token atual para obter um novo token
      // de longa duração da API do Facebook
      // Por enquanto, vamos simular uma renovação bem-sucedida
      
      // Obter um novo token de longa duração (simulado)
      const newToken = `renewed_token_${Date.now()}`;
      
      // Armazenar o novo token
      await this.storeToken(storedToken.integrationId, newToken, storedToken.metadata);
      
      // Retornar o novo token
      return await this.getToken(storedToken.integrationId);
    } catch (error) {
      console.error('Erro ao renovar token do Meta:', error);
      throw new AppError('Falha ao renovar token de acesso', 500);
    }
  }
  
  /**
   * Verifica o status de um token de acesso do Meta
   * @param {string} integrationId - ID da integração
   * @returns {Promise<Object>} Objeto com informações sobre o status do token
   */
  async verifyToken(integrationId) {
    try {
      // Buscar token no banco de dados
      const storedToken = await MetaToken.findOne({ integrationId });
      
      if (!storedToken) {
        throw new AppError('Token não encontrado para esta integração', 404);
      }
      
      // Verificar se o token está expirado
      if (storedToken.expiresAt && new Date(storedToken.expiresAt) < new Date()) {
        // Tentar renovar o token se possível
        if (process.env.TOKEN_REFRESH_ENABLED === 'true') {
          try {
            // Tentar renovar o token
            await this.renewToken(storedToken);
            
            // Buscar o token atualizado
            const updatedToken = await MetaToken.findOne({ integrationId });
            
            // Retornar informações do token renovado
            return {
              status: 'active',
              expiresAt: updatedToken.expiresAt,
              scopes: updatedToken.metadata.scopes || [],
              isRenewed: true,
              lastVerifiedAt: Date.now()
            };
          } catch (renewError) {
            // Se não for possível renovar, marcar como inativo
            await storedToken.deactivate('Token expirado e não foi possível renová-lo');
            
            return {
              status: 'expired',
              expiresAt: storedToken.expiresAt,
              scopes: storedToken.metadata.scopes || [],
              isRenewed: false,
              lastVerifiedAt: Date.now()
            };
          }
        } else {
          // Marcar como inativo se a renovação não estiver habilitada
          await storedToken.deactivate('Token expirado');
          
          return {
            status: 'expired',
            expiresAt: storedToken.expiresAt,
            scopes: storedToken.metadata.scopes || [],
            isRenewed: false,
            lastVerifiedAt: Date.now()
          };
        }
      }
      
      // Se o token não estiver expirado, verificar se ainda é válido
      try {
        // Descriptografar o token
        const tokenData = tokenManager.retrieveToken({
          encryptedToken: storedToken.encryptedToken,
          iv: storedToken.iv,
          authTag: storedToken.authTag,
        });
        
        if (!tokenData.isValid) {
          throw new Error('Token inválido ou corrompido');
        }
        
        // Verificar o token com a API do Meta
        const tokenInfo = await this.getTokenInfo(tokenData.token);
        
        // Atualizar informações de verificação
        storedToken.lastVerifiedAt = Date.now();
        storedToken.lastVerificationResult = {
          success: tokenInfo.isValid,
          message: tokenInfo.isValid ? 'Token verificado com sucesso' : 'Token inválido',
          timestamp: Date.now()
        };
        await storedToken.save();
        
        // Retornar informações do token
        return {
          status: tokenInfo.isValid ? 'active' : 'invalid',
          expiresAt: tokenInfo.expiresAt || storedToken.expiresAt,
          scopes: tokenInfo.scopes || storedToken.metadata.scopes || [],
          userId: tokenInfo.userId,
          lastVerifiedAt: storedToken.lastVerifiedAt
        };
      } catch (error) {
        // Se a verificação falhar, marcar o token como inválido
        const errorMessage = error.response?.data?.error?.message || error.message || 'Falha ao verificar token';
        await storedToken.deactivate(errorMessage);
        
        return {
          status: 'invalid',
          expiresAt: storedToken.expiresAt,
          scopes: storedToken.metadata.scopes || [],
          error: errorMessage,
          lastVerifiedAt: Date.now()
        };
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Erro ao verificar token do Meta:', error);
      throw new AppError('Falha ao verificar token de acesso', 500);
    }
  }
  
  /**
   * Remove um token de acesso do Meta
   * @param {string} integrationId - ID da integração
   * @returns {Promise<Object>} Resultado da remoção
   */
  async removeToken(integrationId) {
    try {
      const result = await MetaToken.deleteOne({ integrationId });
      
      if (result.deletedCount === 0) {
        throw new AppError('Token não encontrado para esta integração', 404);
      }
      
      return { success: true, message: 'Token removido com sucesso' };
    } catch (error) {
      console.error('Erro ao remover token do Meta:', error);
      throw new AppError('Falha ao remover token de acesso', 500);
    }
  }
}

module.exports = new MetaTokenService();
