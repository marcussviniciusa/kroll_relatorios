const Joi = require('joi');

/**
 * Validadores para operações relacionadas a dashboards
 */
const dashboardValidator = {
  /**
   * Validação para criação de dashboard
   */
  createDashboard: Joi.object({
    name: Joi.string().required().min(3).max(100),
    description: Joi.string().allow('').max(500),
    layout: Joi.array().items(
      Joi.object({
        i: Joi.string().required(),
        x: Joi.number().required(),
        y: Joi.number().required(),
        w: Joi.number().required(),
        h: Joi.number().required(),
        minW: Joi.number(),
        maxW: Joi.number(),
        minH: Joi.number(),
        maxH: Joi.number(),
        static: Joi.boolean()
      })
    ),
    isPublic: Joi.boolean(),
    password: Joi.string().allow('').max(100),
    companyId: Joi.number().required()
  }),

  /**
   * Validação para atualização de dashboard
   */
  updateDashboard: Joi.object({
    name: Joi.string().min(3).max(100),
    description: Joi.string().allow('').max(500),
    layout: Joi.array().items(
      Joi.object({
        i: Joi.string().required(),
        x: Joi.number().required(),
        y: Joi.number().required(),
        w: Joi.number().required(),
        h: Joi.number().required(),
        minW: Joi.number(),
        maxW: Joi.number(),
        minH: Joi.number(),
        maxH: Joi.number(),
        static: Joi.boolean()
      })
    ),
    isPublic: Joi.boolean(),
    password: Joi.string().allow('').max(100)
  }),

  /**
   * Validação para compartilhamento de dashboard
   */
  shareDashboard: Joi.object({
    isPublic: Joi.boolean().required(),
    password: Joi.string().allow('').max(100),
    expiresAt: Joi.date().iso().allow(null)
  }),

  /**
   * Validação para verificação de senha de dashboard compartilhado
   */
  verifyPassword: Joi.object({
    password: Joi.string().required()
  })
};

module.exports = dashboardValidator;
