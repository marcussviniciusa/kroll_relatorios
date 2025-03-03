const crypto = require('crypto');

/**
 * Utilitário para gerenciar tokens de acesso de forma segura
 * Implementa criptografia e métodos para armazenar e recuperar tokens
 */
class TokenManager {
  constructor() {
    // Em produção, esta chave deve vir de variáveis de ambiente
    this.encryptionKey = process.env.TOKEN_ENCRYPTION_KEY || 'default-encryption-key-for-development';
    this.algorithm = 'aes-256-gcm';
  }

  /**
   * Criptografa um token para armazenamento seguro
   * @param {string} token - Token a ser criptografado
   * @returns {Object} Objeto contendo dados criptografados e metadados necessários para descriptografia
   */
  encryptToken(token) {
    try {
      // Gerar um IV (Initialization Vector) aleatório
      const iv = crypto.randomBytes(16);
      
      // Criar cipher com a chave e IV
      const cipher = crypto.createCipheriv(
        this.algorithm, 
        crypto.scryptSync(this.encryptionKey, 'salt', 32),
        iv
      );
      
      // Criptografar o token
      let encryptedToken = cipher.update(token, 'utf8', 'hex');
      encryptedToken += cipher.final('hex');
      
      // Obter a tag de autenticação
      const authTag = cipher.getAuthTag();
      
      return {
        encryptedToken,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex')
      };
    } catch (error) {
      console.error('Erro ao criptografar token:', error);
      throw new Error('Falha ao criptografar token');
    }
  }

  /**
   * Descriptografa um token armazenado
   * @param {Object} encryptedData - Objeto contendo token criptografado e metadados
   * @returns {string} Token descriptografado
   */
  decryptToken(encryptedData) {
    try {
      const { encryptedToken, iv, authTag } = encryptedData;
      
      // Criar decipher com a chave e IV
      const decipher = crypto.createDecipheriv(
        this.algorithm,
        crypto.scryptSync(this.encryptionKey, 'salt', 32),
        Buffer.from(iv, 'hex')
      );
      
      // Definir a tag de autenticação
      decipher.setAuthTag(Buffer.from(authTag, 'hex'));
      
      // Descriptografar o token
      let decryptedToken = decipher.update(encryptedToken, 'hex', 'utf8');
      decryptedToken += decipher.final('utf8');
      
      return decryptedToken;
    } catch (error) {
      console.error('Erro ao descriptografar token:', error);
      throw new Error('Falha ao descriptografar token');
    }
  }

  /**
   * Gera um hash para identificação segura de um token
   * @param {string} token - Token para gerar hash
   * @returns {string} Hash do token
   */
  generateTokenHash(token) {
    return crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
  }

  /**
   * Verifica se um token está expirado
   * @param {number} expiresAt - Timestamp de expiração do token
   * @returns {boolean} True se o token estiver expirado
   */
  isTokenExpired(expiresAt) {
    return Date.now() > expiresAt;
  }

  /**
   * Prepara um token para armazenamento seguro
   * @param {string} token - Token a ser armazenado
   * @param {number} expiresIn - Tempo de expiração em segundos (opcional)
   * @returns {Object} Objeto com dados do token para armazenamento
   */
  prepareTokenForStorage(token, expiresIn = null) {
    // Criptografar o token
    const encryptedData = this.encryptToken(token);
    
    // Calcular data de expiração se fornecida
    const expiresAt = expiresIn ? Date.now() + (expiresIn * 1000) : null;
    
    // Gerar hash para identificação do token
    const tokenHash = this.generateTokenHash(token);
    
    return {
      ...encryptedData,
      tokenHash,
      expiresAt,
      createdAt: Date.now()
    };
  }

  /**
   * Recupera um token armazenado
   * @param {Object} storedToken - Objeto com dados do token armazenado
   * @returns {Object} Objeto com token descriptografado e status
   */
  retrieveToken(storedToken) {
    try {
      // Verificar se o token está expirado
      if (storedToken.expiresAt && this.isTokenExpired(storedToken.expiresAt)) {
        return {
          token: null,
          isValid: false,
          isExpired: true
        };
      }
      
      // Descriptografar o token
      const token = this.decryptToken({
        encryptedToken: storedToken.encryptedToken,
        iv: storedToken.iv,
        authTag: storedToken.authTag
      });
      
      return {
        token,
        isValid: true,
        isExpired: false
      };
    } catch (error) {
      return {
        token: null,
        isValid: false,
        isExpired: false,
        error: error.message
      };
    }
  }
}

module.exports = new TokenManager();
