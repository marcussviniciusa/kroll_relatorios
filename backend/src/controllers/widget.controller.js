const { Widget, Dashboard } = require('../models');
const AppError = require('../utils/appError');
const logger = require('../utils/logger');
const metaService = require('../services/meta.service');
const googleAnalyticsService = require('../services/googleAnalytics.service');
const dashboardController = require('./dashboard.controller');

/**
 * Widget Controller
 * Handles all operations related to dashboard widgets
 */

exports.getWidgetsByDashboard = async (req, res, next) => {
  try {
    const { dashboardId } = req.params;
    
    // Find dashboard and check access
    const dashboard = await Dashboard.findByPk(dashboardId);
    if (!dashboard) {
      return next(new AppError('Dashboard não encontrado', 404));
    }
    
    const hasAccess = await dashboardController.checkDashboardAccess(req.user, dashboard, 'view');
    if (!hasAccess) {
      return next(new AppError('Você não tem permissão para acessar este dashboard', 403));
    }
    
    // Get widgets for this dashboard
    const widgets = await Widget.findAll({
      where: { DashboardId: dashboardId },
      order: [['createdAt', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      data: widgets
    });
  } catch (error) {
    logger.error('Error in getWidgetsByDashboard:', error);
    next(error);
  }
};

exports.getWidgetById = async (req, res, next) => {
  try {
    const { dashboardId, widgetId } = req.params;
    
    // Find dashboard and check access
    const dashboard = await Dashboard.findByPk(dashboardId);
    if (!dashboard) {
      return next(new AppError('Dashboard não encontrado', 404));
    }
    
    const hasAccess = await dashboardController.checkDashboardAccess(req.user, dashboard, 'view');
    if (!hasAccess) {
      return next(new AppError('Você não tem permissão para acessar este dashboard', 403));
    }
    
    // Get specific widget
    const widget = await Widget.findOne({
      where: { 
        id: widgetId,
        DashboardId: dashboardId
      }
    });
    
    if (!widget) {
      return next(new AppError('Widget não encontrado', 404));
    }
    
    res.status(200).json({
      success: true,
      data: widget
    });
  } catch (error) {
    logger.error('Error in getWidgetById:', error);
    next(error);
  }
};

exports.createWidget = async (req, res, next) => {
  try {
    const { dashboardId } = req.params;
    const widgetData = req.body;
    
    // Find dashboard and check access
    const dashboard = await Dashboard.findByPk(dashboardId);
    if (!dashboard) {
      return next(new AppError('Dashboard não encontrado', 404));
    }
    
    const hasAccess = await dashboardController.checkDashboardAccess(req.user, dashboard, 'edit');
    if (!hasAccess) {
      return next(new AppError('Você não tem permissão para editar este dashboard', 403));
    }
    
    // Set dashboard id and user who created
    widgetData.DashboardId = dashboardId;
    widgetData.createdBy = req.user.id;
    widgetData.updatedBy = req.user.id;
    
    // Create widget
    const widget = await Widget.create(widgetData);
    
    // If dashboard has company, check integrations
    if (dashboard.CompanyId && widgetData.dataSource !== 'manual') {
      // This would be implemented to initialize data for the widget
      await this.initializeWidgetData(widget, dashboard.CompanyId);
    }
    
    res.status(201).json({
      success: true,
      data: widget
    });
  } catch (error) {
    logger.error('Error in createWidget:', error);
    next(error);
  }
};

exports.updateWidget = async (req, res, next) => {
  try {
    const { dashboardId, widgetId } = req.params;
    const updateData = req.body;
    
    // Find dashboard and check access
    const dashboard = await Dashboard.findByPk(dashboardId);
    if (!dashboard) {
      return next(new AppError('Dashboard não encontrado', 404));
    }
    
    const hasAccess = await dashboardController.checkDashboardAccess(req.user, dashboard, 'edit');
    if (!hasAccess) {
      return next(new AppError('Você não tem permissão para editar este dashboard', 403));
    }
    
    // Find widget
    const widget = await Widget.findOne({
      where: { 
        id: widgetId,
        DashboardId: dashboardId
      }
    });
    
    if (!widget) {
      return next(new AppError('Widget não encontrado', 404));
    }
    
    // Set user who updated
    updateData.updatedBy = req.user.id;
    
    // Check if data source or query changed
    const dataSourceChanged = 
      updateData.dataSource && updateData.dataSource !== widget.dataSource;
    const queryChanged = 
      updateData.query && JSON.stringify(updateData.query) !== JSON.stringify(widget.query);
    
    // Update widget
    await widget.update(updateData);
    
    // If data source or query changed, refresh widget data
    if (dataSourceChanged || queryChanged) {
      if (dashboard.CompanyId) {
        // This would be implemented to refresh data for the widget
        await this.refreshWidgetData(widget, dashboard.CompanyId);
      }
    }
    
    res.status(200).json({
      success: true,
      data: widget
    });
  } catch (error) {
    logger.error('Error in updateWidget:', error);
    next(error);
  }
};

exports.deleteWidget = async (req, res, next) => {
  try {
    const { dashboardId, widgetId } = req.params;
    
    // Find dashboard and check access
    const dashboard = await Dashboard.findByPk(dashboardId);
    if (!dashboard) {
      return next(new AppError('Dashboard não encontrado', 404));
    }
    
    const hasAccess = await dashboardController.checkDashboardAccess(req.user, dashboard, 'edit');
    if (!hasAccess) {
      return next(new AppError('Você não tem permissão para editar este dashboard', 403));
    }
    
    // Find widget
    const widget = await Widget.findOne({
      where: { 
        id: widgetId,
        DashboardId: dashboardId
      }
    });
    
    if (!widget) {
      return next(new AppError('Widget não encontrado', 404));
    }
    
    // Delete widget (soft delete)
    await widget.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Widget excluído com sucesso'
    });
  } catch (error) {
    logger.error('Error in deleteWidget:', error);
    next(error);
  }
};

exports.cloneWidget = async (req, res, next) => {
  try {
    const { dashboardId, widgetId } = req.params;
    const { name, targetDashboardId } = req.body;
    
    // Find source dashboard and check access
    const sourceDashboard = await Dashboard.findByPk(dashboardId);
    if (!sourceDashboard) {
      return next(new AppError('Dashboard de origem não encontrado', 404));
    }
    
    const hasSourceAccess = await dashboardController.checkDashboardAccess(req.user, sourceDashboard, 'view');
    if (!hasSourceAccess) {
      return next(new AppError('Você não tem permissão para acessar o dashboard de origem', 403));
    }
    
    // Find source widget
    const sourceWidget = await Widget.findOne({
      where: { 
        id: widgetId,
        DashboardId: dashboardId
      }
    });
    
    if (!sourceWidget) {
      return next(new AppError('Widget de origem não encontrado', 404));
    }
    
    // If cloning to a different dashboard, check access to target dashboard
    let targetDashboard = sourceDashboard;
    if (targetDashboardId && targetDashboardId !== dashboardId) {
      targetDashboard = await Dashboard.findByPk(targetDashboardId);
      
      if (!targetDashboard) {
        return next(new AppError('Dashboard de destino não encontrado', 404));
      }
      
      const hasTargetAccess = await dashboardController.checkDashboardAccess(req.user, targetDashboard, 'edit');
      if (!hasTargetAccess) {
        return next(new AppError('Você não tem permissão para editar o dashboard de destino', 403));
      }
    }
    
    // Clone widget
    const clonedWidget = await sourceWidget.clone({
      name,
      dashboardId: targetDashboard.id,
      userId: req.user.id
    });
    
    res.status(201).json({
      success: true,
      data: clonedWidget
    });
  } catch (error) {
    logger.error('Error in cloneWidget:', error);
    next(error);
  }
};

// Helper methods for widget data operations

exports.initializeWidgetData = async (widget, companyId) => {
  try {
    // Switch based on data source
    switch (widget.dataSource) {
      case 'meta':
        await this.initializeMetaWidgetData(widget, companyId);
        break;
        
      case 'googleAnalytics':
        await this.initializeGoogleAnalyticsWidgetData(widget, companyId);
        break;
        
      case 'combined':
        // For combined sources, initialize each source
        await this.initializeCombinedWidgetData(widget, companyId);
        break;
        
      case 'custom':
      case 'manual':
        // Nothing to initialize for custom or manual data
        break;
        
      default:
        logger.warn(`Unsupported data source: ${widget.dataSource}`);
        break;
    }
  } catch (error) {
    logger.error(`Error initializing widget data: ${error.message}`, {
      widgetId: widget.id,
      dataSource: widget.dataSource,
      companyId
    });
    
    // Set error status on widget
    await widget.setError(`Erro ao inicializar dados: ${error.message}`);
  }
};

exports.refreshWidgetData = async (widget, companyId) => {
  try {
    // Switch based on data source
    switch (widget.dataSource) {
      case 'meta':
        await this.refreshMetaWidgetData(widget, companyId);
        break;
        
      case 'googleAnalytics':
        await this.refreshGoogleAnalyticsWidgetData(widget, companyId);
        break;
        
      case 'combined':
        // For combined sources, refresh each source
        await this.refreshCombinedWidgetData(widget, companyId);
        break;
        
      case 'custom':
      case 'manual':
        // Nothing to refresh for custom or manual data
        break;
        
      default:
        logger.warn(`Unsupported data source: ${widget.dataSource}`);
        break;
    }
  } catch (error) {
    logger.error(`Error refreshing widget data: ${error.message}`, {
      widgetId: widget.id,
      dataSource: widget.dataSource,
      companyId
    });
    
    // Set error status on widget
    await widget.setError(`Erro ao atualizar dados: ${error.message}`);
  }
};

exports.initializeMetaWidgetData = async (widget, companyId) => {
  // This would interact with the Meta API to get initial data
  logger.info(`Initializing Meta widget data for widget ${widget.id}`);
  
  // Example of how this might work:
  // 1. Get company's Meta integration
  // 2. Use the integration to fetch data based on widget's query
  // 3. Update widget's cache with the data
  
  // Placeholder implementation
  const mockData = await metaService.fetchDataForWidget(widget.query, companyId);
  await widget.updateCache(mockData);
};

exports.refreshMetaWidgetData = async (widget, companyId) => {
  // This would refresh data from the Meta API
  logger.info(`Refreshing Meta widget data for widget ${widget.id}`);
  
  // Similar to initializeMetaWidgetData but would be used for updates
  
  // Placeholder implementation
  const mockData = await metaService.fetchDataForWidget(widget.query, companyId);
  await widget.updateCache(mockData);
};

exports.initializeGoogleAnalyticsWidgetData = async (widget, companyId) => {
  // This would interact with the Google Analytics API to get initial data
  logger.info(`Initializing Google Analytics widget data for widget ${widget.id}`);
  
  // Example of how this might work:
  // 1. Get company's Google Analytics integration
  // 2. Use the integration to fetch data based on widget's query
  // 3. Update widget's cache with the data
  
  // Placeholder implementation
  const mockData = await googleAnalyticsService.fetchDataForWidget(widget.query, companyId);
  await widget.updateCache(mockData);
};

exports.refreshGoogleAnalyticsWidgetData = async (widget, companyId) => {
  // This would refresh data from the Google Analytics API
  logger.info(`Refreshing Google Analytics widget data for widget ${widget.id}`);
  
  // Similar to initializeGoogleAnalyticsWidgetData but would be used for updates
  
  // Placeholder implementation
  const mockData = await googleAnalyticsService.fetchDataForWidget(widget.query, companyId);
  await widget.updateCache(mockData);
};

exports.initializeCombinedWidgetData = async (widget, companyId) => {
  // This would handle widgets that combine data from multiple sources
  logger.info(`Initializing combined data for widget ${widget.id}`);
  
  // Example of how this might work:
  // 1. Loop through each data source in the widget's query
  // 2. Fetch data from each source
  // 3. Combine the data according to the widget's configuration
  // 4. Update widget's cache with the combined data
  
  // Placeholder implementation
  const combinedData = {
    meta: await metaService.fetchDataForWidget(widget.query.meta, companyId),
    googleAnalytics: await googleAnalyticsService.fetchDataForWidget(widget.query.googleAnalytics, companyId)
  };
  
  await widget.updateCache(combinedData);
};

exports.refreshCombinedWidgetData = async (widget, companyId) => {
  // This would refresh combined data from multiple sources
  logger.info(`Refreshing combined data for widget ${widget.id}`);
  
  // Similar to initializeCombinedWidgetData but would be used for updates
  
  // Placeholder implementation
  const combinedData = {
    meta: await metaService.fetchDataForWidget(widget.query.meta, companyId),
    googleAnalytics: await googleAnalyticsService.fetchDataForWidget(widget.query.googleAnalytics, companyId)
  };
  
  await widget.updateCache(combinedData);
};
