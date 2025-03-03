const Joi = require('joi');

/**
 * Validadores para operações relacionadas a widgets
 */
const widgetValidator = {
  /**
   * Validação para criação de widget
   */
  createWidget: Joi.object({
    title: Joi.string().required().min(3).max(100),
    type: Joi.string().required().valid('chart', 'metric', 'table', 'text', 'custom'),
    config: Joi.object({
      chartType: Joi.string().when('type', {
        is: 'chart',
        then: Joi.valid('line', 'bar', 'pie', 'doughnut', 'radar', 'polarArea').required(),
        otherwise: Joi.optional()
      }),
      dataSource: Joi.string().required(),
      query: Joi.string().allow(''),
      refreshInterval: Joi.number().integer().min(0),
      colors: Joi.array().items(Joi.string()),
      dateRange: Joi.object({
        start: Joi.date().iso(),
        end: Joi.date().iso(),
        preset: Joi.string().valid('today', 'yesterday', 'last7days', 'last30days', 'thisMonth', 'lastMonth', 'custom')
      }),
      dimensions: Joi.array().items(Joi.string()),
      metrics: Joi.array().items(Joi.string()),
      filters: Joi.array().items(
        Joi.object({
          dimension: Joi.string().required(),
          operator: Joi.string().valid('=', '!=', '>', '<', '>=', '<=', 'contains', 'not_contains').required(),
          value: Joi.alternatives().try(Joi.string(), Joi.number(), Joi.boolean(), Joi.array()).required()
        })
      ),
      textContent: Joi.string().when('type', {
        is: 'text',
        then: Joi.required(),
        otherwise: Joi.optional()
      }),
      customConfig: Joi.object().when('type', {
        is: 'custom',
        then: Joi.required(),
        otherwise: Joi.optional()
      })
    }).required(),
    dashboardId: Joi.number().required()
  }),

  /**
   * Validação para atualização de widget
   */
  updateWidget: Joi.object({
    title: Joi.string().min(3).max(100),
    type: Joi.string().valid('chart', 'metric', 'table', 'text', 'custom'),
    config: Joi.object({
      chartType: Joi.string().valid('line', 'bar', 'pie', 'doughnut', 'radar', 'polarArea'),
      dataSource: Joi.string(),
      query: Joi.string().allow(''),
      refreshInterval: Joi.number().integer().min(0),
      colors: Joi.array().items(Joi.string()),
      dateRange: Joi.object({
        start: Joi.date().iso(),
        end: Joi.date().iso(),
        preset: Joi.string().valid('today', 'yesterday', 'last7days', 'last30days', 'thisMonth', 'lastMonth', 'custom')
      }),
      dimensions: Joi.array().items(Joi.string()),
      metrics: Joi.array().items(Joi.string()),
      filters: Joi.array().items(
        Joi.object({
          dimension: Joi.string().required(),
          operator: Joi.string().valid('=', '!=', '>', '<', '>=', '<=', 'contains', 'not_contains').required(),
          value: Joi.alternatives().try(Joi.string(), Joi.number(), Joi.boolean(), Joi.array()).required()
        })
      ),
      textContent: Joi.string(),
      customConfig: Joi.object()
    })
  }),

  /**
   * Validação para consulta de dados do widget
   */
  queryWidgetData: Joi.object({
    dateRange: Joi.object({
      start: Joi.date().iso(),
      end: Joi.date().iso(),
      preset: Joi.string().valid('today', 'yesterday', 'last7days', 'last30days', 'thisMonth', 'lastMonth', 'custom')
    }),
    filters: Joi.array().items(
      Joi.object({
        dimension: Joi.string().required(),
        operator: Joi.string().valid('=', '!=', '>', '<', '>=', '<=', 'contains', 'not_contains').required(),
        value: Joi.alternatives().try(Joi.string(), Joi.number(), Joi.boolean(), Joi.array()).required()
      })
    )
  })
};

module.exports = widgetValidator;
