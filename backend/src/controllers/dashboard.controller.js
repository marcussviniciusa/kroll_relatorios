const { Dashboard, Widget, User, Company } = require('../models');
const { Op } = require('sequelize');
const AppError = require('../utils/appError');
const logger = require('../utils/logger');

/**
 * Dashboard Controller
 * Handles all operations related to dashboards
 */
exports.getAllDashboards = async (req, res, next) => {
  try {
    const { companyId, status, category, tags, search, isTemplate } = req.query;
    let { page = 1, limit = 10, order = 'updatedAt', direction = 'DESC' } = req.query;
    
    page = parseInt(page);
    limit = parseInt(limit);
    
    // Build filters
    const where = {};
    const include = [];
    
    // Company filter
    if (companyId) {
      where.CompanyId = companyId;
    }
    
    // Status filter
    if (status) {
      where.status = status;
    }
    
    // Category filter
    if (category) {
      where.category = category;
    }
    
    // Tags filter (array)
    if (tags) {
      if (Array.isArray(tags)) {
        where.tags = { [Op.overlap]: tags };
      } else {
        where.tags = { [Op.contains]: [tags] };
      }
    }
    
    // Template filter
    if (isTemplate !== undefined) {
      where.isTemplate = isTemplate === 'true';
    }
    
    // Search filter
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    // Role-based access control
    if (req.user.role !== 'admin') {
      // Non-admin users can only see dashboards they have explicit access to
      // or dashboards for companies they have access to
      include.push({
        model: User,
        as: 'users',
        where: { id: req.user.id },
        attributes: [],
        required: false
      });
      
      include.push({
        model: Company,
        as: 'company',
        required: false
      });
      
      where[Op.or] = [
        { '$users.id$': req.user.id },
        { '$company.id$': { [Op.in]: req.user.companyIds || [] } }
      ];
    }
    
    // Query dashboards with pagination
    const { count, rows } = await Dashboard.findAndCountAll({
      where,
      include,
      order: [[order, direction]],
      limit,
      offset: (page - 1) * limit,
      distinct: true
    });
    
    // Get widget counts for each dashboard
    const dashboardsWithWidgetCount = await Promise.all(rows.map(async (dashboard) => {
      const widgetCount = await Widget.count({ where: { DashboardId: dashboard.id } });
      const dashboardData = dashboard.toJSON();
      dashboardData.widgetCount = widgetCount;
      return dashboardData;
    }));
    
    // Return response with pagination metadata
    res.status(200).json({
      success: true,
      data: dashboardsWithWidgetCount,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    logger.error('Error in getAllDashboards:', error);
    next(error);
  }
};

exports.getDashboardById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { includeWidgets, incrementViews } = req.query;
    
    // Include widgets if requested
    const include = [];
    if (includeWidgets === 'true') {
      include.push({
        model: Widget,
        as: 'widgets',
        where: { status: { [Op.ne]: 'draft' } },
        required: false
      });
    }
    
    // Fetch dashboard
    const dashboard = await Dashboard.findByPk(id, { include });
    
    if (!dashboard) {
      return next(new AppError('Dashboard não encontrado', 404));
    }
    
    // Check for public access
    const isPublic = dashboard.isPublic && !dashboard.isShareExpired();
    
    // Check authorization for non-public dashboards
    if (!isPublic) {
      // Only allow if user is authenticated and has access
      if (!req.user) {
        return next(new AppError('Não autorizado', 401));
      }
      
      const hasAccess = await this.checkDashboardAccess(req.user, dashboard, 'view');
      if (!hasAccess) {
        return next(new AppError('Acesso negado', 403));
      }
    }
    
    // Increment views if requested
    if (incrementViews === 'true') {
      await dashboard.incrementViews();
    }
    
    res.status(200).json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    logger.error('Error in getDashboardById:', error);
    next(error);
  }
};

exports.createDashboard = async (req, res, next) => {
  try {
    const { companyId, ...dashboardData } = req.body;
    
    // Validate company access
    if (companyId) {
      const hasCompanyAccess = await this.checkCompanyAccess(req.user, companyId);
      if (!hasCompanyAccess) {
        return next(new AppError('Você não tem acesso a esta empresa', 403));
      }
      dashboardData.CompanyId = companyId;
    }
    
    // Create dashboard
    const dashboard = await Dashboard.create(dashboardData);
    
    // Add creator as owner
    if (req.user) {
      await dashboard.addUser(req.user.id, { through: { role: 'owner' } });
    }
    
    res.status(201).json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    logger.error('Error in createDashboard:', error);
    next(error);
  }
};

exports.updateDashboard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Find dashboard
    const dashboard = await Dashboard.findByPk(id);
    
    if (!dashboard) {
      return next(new AppError('Dashboard não encontrado', 404));
    }
    
    // Check authorization
    const hasAccess = await this.checkDashboardAccess(req.user, dashboard, 'edit');
    if (!hasAccess) {
      return next(new AppError('Você não tem permissão para editar este dashboard', 403));
    }
    
    // Update dashboard
    await dashboard.update(updateData);
    
    res.status(200).json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    logger.error('Error in updateDashboard:', error);
    next(error);
  }
};

exports.deleteDashboard = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Find dashboard
    const dashboard = await Dashboard.findByPk(id);
    
    if (!dashboard) {
      return next(new AppError('Dashboard não encontrado', 404));
    }
    
    // Check authorization
    const hasAccess = await this.checkDashboardAccess(req.user, dashboard, 'delete');
    if (!hasAccess) {
      return next(new AppError('Você não tem permissão para excluir este dashboard', 403));
    }
    
    // Soft delete dashboard
    await dashboard.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Dashboard excluído com sucesso'
    });
  } catch (error) {
    logger.error('Error in deleteDashboard:', error);
    next(error);
  }
};

exports.shareDashboard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { expiresIn, password } = req.body;
    
    // Find dashboard
    const dashboard = await Dashboard.findByPk(id);
    
    if (!dashboard) {
      return next(new AppError('Dashboard não encontrado', 404));
    }
    
    // Check authorization
    const hasAccess = await this.checkDashboardAccess(req.user, dashboard, 'share');
    if (!hasAccess) {
      return next(new AppError('Você não tem permissão para compartilhar este dashboard', 403));
    }
    
    // Generate share link
    const publicAccessKey = await dashboard.generateShareLink(expiresIn, password);
    
    // Construct share URL
    const shareUrl = `${process.env.FRONTEND_URL}/public/dashboard/${publicAccessKey}`;
    
    res.status(200).json({
      success: true,
      data: {
        shareUrl,
        publicAccessKey,
        hasPassword: !!dashboard.publicAccessPassword,
        expiresAt: dashboard.publicExpiresAt
      }
    });
  } catch (error) {
    logger.error('Error in shareDashboard:', error);
    next(error);
  }
};

exports.getSharedDashboard = async (req, res, next) => {
  try {
    const { accessKey } = req.params;
    const { password } = req.body;
    
    // Find dashboard by access key
    const dashboard = await Dashboard.findOne({
      where: { publicAccessKey: accessKey },
      include: [{
        model: Widget,
        as: 'widgets',
        where: { status: 'active' },
        required: false
      }]
    });
    
    if (!dashboard) {
      return next(new AppError('Dashboard não encontrado ou link inválido', 404));
    }
    
    // Check if share link is expired
    if (dashboard.isShareExpired()) {
      return next(new AppError('Este link de compartilhamento expirou', 403));
    }
    
    // Verify password if required
    if (dashboard.publicAccessPassword) {
      if (!password) {
        return res.status(401).json({
          success: false,
          requiresPassword: true,
          message: 'Este dashboard está protegido por senha'
        });
      }
      
      const isValidPassword = await dashboard.verifySharePassword(password);
      if (!isValidPassword) {
        return next(new AppError('Senha incorreta', 401));
      }
    }
    
    // Increment view count
    await dashboard.incrementViews();
    
    res.status(200).json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    logger.error('Error in getSharedDashboard:', error);
    next(error);
  }
};

exports.duplicateDashboard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, companyId } = req.body;
    
    // Find source dashboard with widgets
    const sourceDashboard = await Dashboard.findByPk(id, {
      include: [{ model: Widget, as: 'widgets' }]
    });
    
    if (!sourceDashboard) {
      return next(new AppError('Dashboard não encontrado', 404));
    }
    
    // Check authorization for source dashboard
    const hasAccess = await this.checkDashboardAccess(req.user, sourceDashboard, 'view');
    if (!hasAccess) {
      return next(new AppError('Você não tem acesso a este dashboard', 403));
    }
    
    // If companyId provided, check company access
    if (companyId) {
      const hasCompanyAccess = await this.checkCompanyAccess(req.user, companyId);
      if (!hasCompanyAccess) {
        return next(new AppError('Você não tem acesso a esta empresa', 403));
      }
    }
    
    // Clone dashboard data
    const dashboardData = sourceDashboard.toJSON();
    delete dashboardData.id;
    delete dashboardData.createdAt;
    delete dashboardData.updatedAt;
    delete dashboardData.deletedAt;
    delete dashboardData.publicAccessKey;
    delete dashboardData.publicAccessPassword;
    delete dashboardData.publicExpiresAt;
    delete dashboardData.views;
    delete dashboardData.lastViewedAt;
    
    // Set new values
    dashboardData.name = name || `${dashboardData.name} (Copy)`;
    dashboardData.isPublic = false;
    dashboardData.CompanyId = companyId || sourceDashboard.CompanyId;
    
    // Create new dashboard
    const newDashboard = await Dashboard.create(dashboardData);
    
    // Clone widgets if exists
    if (sourceDashboard.widgets && sourceDashboard.widgets.length > 0) {
      const widgets = sourceDashboard.widgets;
      
      for (const widget of widgets) {
        await widget.clone({
          dashboardId: newDashboard.id,
          userId: req.user.id
        });
      }
    }
    
    // Add user as owner of the new dashboard
    await newDashboard.addUser(req.user.id, { through: { role: 'owner' } });
    
    // Return new dashboard with widgets
    const result = await Dashboard.findByPk(newDashboard.id, {
      include: [{ model: Widget, as: 'widgets' }]
    });
    
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Error in duplicateDashboard:', error);
    next(error);
  }
};

/**
 * Verifica a senha de um dashboard compartilhado
 * @route POST /api/dashboards/public/:accessKey/verify-password
 * @access Public
 */
exports.verifySharedDashboardPassword = async (req, res, next) => {
  try {
    const { accessKey } = req.params;
    const { password } = req.body;
    
    // Buscar dashboard pelo accessKey
    const dashboard = await Dashboard.findOne({
      where: { 
        publicAccessKey: accessKey,
        isPublic: true,
        status: 'active'
      }
    });
    
    if (!dashboard) {
      return next(new AppError('Dashboard não encontrado ou não está disponível publicamente', 404));
    }
    
    // Verificar se o dashboard requer senha
    if (!dashboard.publicAccessPassword) {
      return res.status(200).json({
        success: true,
        message: 'Este dashboard não requer senha',
        data: { verified: true }
      });
    }
    
    // Verificar a senha
    const isPasswordValid = dashboard.publicAccessPassword === password;
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Senha incorreta',
        data: { verified: false }
      });
    }
    
    // Senha correta
    return res.status(200).json({
      success: true,
      message: 'Senha verificada com sucesso',
      data: { verified: true }
    });
    
  } catch (error) {
    logger.error('Erro ao verificar senha do dashboard compartilhado:', error);
    return next(new AppError('Erro ao verificar senha do dashboard', 500));
  }
};

// Helper methods
exports.checkDashboardAccess = async (user, dashboard, permission = 'view') => {
  if (!user) return false;
  
  // Admin has all permissions
  if (user.role === 'admin') return true;
  
  // Check explicit dashboard permissions via user_dashboards join table
  const userDashboard = await dashboard.getUsers({
    where: { id: user.id }
  });
  
  if (userDashboard && userDashboard.length > 0) {
    const userRole = userDashboard[0].UserDashboard.role;
    const allowedRoles = dashboard.permissions[permission] || [];
    return allowedRoles.includes(userRole);
  }
  
  // Check company-level access
  if (dashboard.CompanyId) {
    // Check if user has access to this company
    const hasCompanyAccess = await this.checkCompanyAccess(user, dashboard.CompanyId);
    if (hasCompanyAccess) {
      // User has company access, check role-based permissions
      const userCompanyRole = user.companies.find(c => c.id === dashboard.CompanyId)?.UserCompany?.role || 'viewer';
      const allowedRoles = dashboard.permissions[permission] || [];
      return allowedRoles.includes(userCompanyRole);
    }
  }
  
  return false;
};

exports.checkCompanyAccess = async (user, companyId) => {
  if (!user) return false;
  
  // Admin has access to all companies
  if (user.role === 'admin') return true;
  
  // Check if user has this company in their accessible companies
  return user.companyIds.includes(companyId);
};
