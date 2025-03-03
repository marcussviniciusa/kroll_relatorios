const { Company, User, UserCompany, sequelize } = require('../models');
const logger = require('../utils/logger');

/**
 * Company controller for handling company-related operations
 */
const companyController = {
  /**
   * Get all companies (with pagination)
   */
  getAllCompanies: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const search = req.query.search || '';
      const status = req.query.status;
      
      // Build where clause
      const whereClause = {};
      if (search) {
        whereClause.name = { [sequelize.Op.iLike]: `%${search}%` };
      }
      if (status) {
        whereClause.status = status;
      }
      
      // Fetch companies with pagination
      const { count, rows } = await Company.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [['name', 'ASC']],
        attributes: { 
          exclude: ['billingInfo'] // Exclude sensitive data
        }
      });
      
      res.status(200).json({
        companies: rows,
        pagination: {
          total: count,
          page,
          limit,
          pages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Get a company by ID
   */
  getCompanyById: async (req, res, next) => {
    try {
      const { id } = req.params;
      
      const company = await Company.findByPk(id, {
        include: [
          {
            model: User,
            through: { attributes: [] }, // Don't include join table
            attributes: ['id', 'firstName', 'lastName', 'email', 'status'],
          }
        ]
      });
      
      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }
      
      res.status(200).json({ company });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Create a new company
   */
  createCompany: async (req, res, next) => {
    const transaction = await sequelize.transaction();
    
    try {
      const {
        name,
        slug,
        website,
        industry,
        size,
        contactEmail,
        contactPhone,
        address,
        dataRetentionPeriod,
        brandColors,
        subscriptionPlan,
        adminUserId
      } = req.body;
      
      // Create company
      const company = await Company.create({
        name,
        slug,
        website,
        industry,
        size,
        contactEmail,
        contactPhone,
        address,
        dataRetentionPeriod,
        brandColors,
        subscriptionPlan
      }, { transaction });
      
      // If an admin user is specified, associate them with the company
      if (adminUserId) {
        await UserCompany.create({
          UserId: adminUserId,
          CompanyId: company.id,
          role: 'admin',
          isDefault: true
        }, { transaction });
      }
      
      await transaction.commit();
      
      logger.info(`Company created: ${company.name} (${company.id})`);
      
      res.status(201).json({
        message: 'Company created successfully',
        company
      });
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  },
  
  /**
   * Update a company
   */
  updateCompany: async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        name,
        website,
        industry,
        size,
        status,
        contactEmail,
        contactPhone,
        address,
        dataRetentionPeriod,
        brandColors,
        subscriptionPlan,
        subscriptionStatus,
        subscriptionEndDate,
        notes
      } = req.body;
      
      const company = await Company.findByPk(id);
      
      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }
      
      // Update company fields
      await company.update({
        name,
        website,
        industry,
        size,
        status,
        contactEmail,
        contactPhone,
        address,
        dataRetentionPeriod,
        brandColors,
        subscriptionPlan,
        subscriptionStatus,
        subscriptionEndDate,
        notes
      });
      
      logger.info(`Company updated: ${company.name} (${company.id})`);
      
      res.status(200).json({
        message: 'Company updated successfully',
        company
      });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Delete a company (soft delete)
   */
  deleteCompany: async (req, res, next) => {
    try {
      const { id } = req.params;
      
      const company = await Company.findByPk(id);
      
      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }
      
      // Soft delete the company
      await company.destroy();
      
      logger.info(`Company deleted: ${company.name} (${company.id})`);
      
      res.status(200).json({
        message: 'Company deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Add a user to a company
   */
  addUserToCompany: async (req, res, next) => {
    try {
      const { companyId, userId, role, isDefault } = req.body;
      
      // Check if company exists
      const company = await Company.findByPk(companyId);
      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }
      
      // Check if user exists
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Check if relation already exists
      const existingRelation = await UserCompany.findOne({
        where: {
          UserId: userId,
          CompanyId: companyId
        }
      });
      
      if (existingRelation) {
        return res.status(400).json({ message: 'User is already associated with this company' });
      }
      
      // Create relation
      await UserCompany.create({
        UserId: userId,
        CompanyId: companyId,
        role: role || 'user',
        isDefault: isDefault || false
      });
      
      logger.info(`User ${userId} added to company ${companyId} with role ${role}`);
      
      res.status(201).json({
        message: 'User added to company successfully'
      });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Remove a user from a company
   */
  removeUserFromCompany: async (req, res, next) => {
    try {
      const { companyId, userId } = req.params;
      
      // Find and delete the relation
      const relation = await UserCompany.findOne({
        where: {
          UserId: userId,
          CompanyId: companyId
        }
      });
      
      if (!relation) {
        return res.status(404).json({ message: 'User is not associated with this company' });
      }
      
      await relation.destroy();
      
      logger.info(`User ${userId} removed from company ${companyId}`);
      
      res.status(200).json({
        message: 'User removed from company successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = companyController;
