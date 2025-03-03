const mongoose = require('mongoose');

/**
 * Modelo para armazenar tokens de acesso do Meta de forma segura
 */
const metaTokenSchema = new mongoose.Schema({
  // Referência à integração
  integrationId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Token criptografado
  encryptedToken: {
    type: String,
    required: true
  },
  
  // Vetor de inicialização para descriptografia
  iv: {
    type: String,
    required: true
  },
  
  // Tag de autenticação para verificação de integridade
  authTag: {
    type: String,
    required: true
  },
  
  // Hash do token para identificação sem descriptografar
  tokenHash: {
    type: String,
    required: true,
    index: true
  },
  
  // Data de expiração do token
  expiresAt: {
    type: Date,
    required: false
  },
  
  // Metadados do token
  metadata: {
    // ID da conta do Facebook
    userId: String,
    
    // Escopos concedidos ao token
    scopes: [String],
    
    // Tipo de token (curto prazo, longo prazo)
    tokenType: {
      type: String,
      enum: ['short_lived', 'long_lived'],
      default: 'short_lived'
    }
  },
  
  // Datas de criação e atualização
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  // Flag para indicar se o token está ativo
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Data da última verificação de validade
  lastVerifiedAt: {
    type: Date
  },
  
  // Resultado da última verificação
  lastVerificationResult: {
    success: Boolean,
    message: String,
    timestamp: Date
  }
});

// Índice para expiração de tokens
metaTokenSchema.index({ expiresAt: 1 });

// Middleware para atualizar o campo updatedAt antes de salvar
metaTokenSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Método para verificar se o token está expirado
metaTokenSchema.methods.isExpired = function() {
  if (!this.expiresAt) return false;
  return Date.now() > this.expiresAt;
};

// Método para marcar o token como inativo
metaTokenSchema.methods.deactivate = function(message = 'Token desativado') {
  this.isActive = false;
  this.lastVerifiedAt = Date.now();
  this.lastVerificationResult = {
    success: false,
    message: message,
    timestamp: Date.now()
  };
  return this.save();
};

// Método para registrar resultado de verificação
metaTokenSchema.methods.recordVerification = function(success, message = '') {
  this.lastVerifiedAt = Date.now();
  this.lastVerificationResult = {
    success,
    message,
    timestamp: Date.now()
  };
  return this.save();
};

const MetaToken = mongoose.model('MetaToken', metaTokenSchema);

module.exports = MetaToken;
