/**
 * Middleware para validar requisições usando Joi
 * @param {Object} schema - Schema Joi para validação
 * @param {string} property - Propriedade da requisição a ser validada (body, params, query)
 * @returns {Function} Middleware Express
 */
const validateRequest = (schema, property = 'body') => {
  return (req, res, next) => {
    if (!schema) return next();

    const { error } = schema.validate(req[property]);
    
    if (!error) return next();

    const { details } = error;
    const message = details.map(i => i.message).join(', ');
    
    return res.status(400).json({ 
      success: false, 
      message: 'Erro de validação', 
      errors: message 
    });
  };
};

module.exports = validateRequest;
