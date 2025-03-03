const { UserCompany } = require('../models');

/**
 * Role-based access control middleware functions
 */

/**
 * Check if user is an admin
 */
const adminOnly = (req, res, next) => {
  // Check if user exists and has admin role
  if (!req.user || !req.user.Role || req.user.Role.name !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  next();
};

/**
 * Check if user is a company owner or admin
 */
const ownerOnly = async (req, res, next) => {
  try {
    // If user is admin, allow access
    if (req.user.Role && req.user.Role.name === 'admin') {
      return next();
    }
    
    // Get company ID from request params or body
    const companyId = req.params.id || req.params.companyId || req.body.companyId;
    
    if (!companyId) {
      return res.status(400).json({ message: 'Company ID is required' });
    }
    
    // Check if user is an owner of the company
    const userCompany = await UserCompany.findOne({
      where: {
        UserId: req.user.id,
        CompanyId: companyId,
        role: 'owner'
      }
    });
    
    if (!userCompany) {
      return res.status(403).json({ message: 'Owner access required' });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Check if user belongs to the company
 */
const companyMemberOnly = async (req, res, next) => {
  try {
    // If user is admin, allow access
    if (req.user.Role && req.user.Role.name === 'admin') {
      return next();
    }
    
    // Get company ID from request
    const companyId = req.params.id || req.params.companyId || req.body.companyId;
    
    if (!companyId) {
      return res.status(400).json({ message: 'Company ID is required' });
    }
    
    // Check if user belongs to the company
    const userCompany = await UserCompany.findOne({
      where: {
        UserId: req.user.id,
        CompanyId: companyId
      }
    });
    
    if (!userCompany) {
      return res.status(403).json({ message: 'Access restricted to company members' });
    }
    
    // Add user's role in this company to the request
    req.userCompanyRole = userCompany.role;
    
    next();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Check if user has a specific role in the company
 */
const hasRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      // If user is admin, allow access
      if (req.user.Role && req.user.Role.name === 'admin') {
        return next();
      }
      
      // Get company ID from request
      const companyId = req.params.id || req.params.companyId || req.body.companyId;
      
      if (!companyId) {
        return res.status(400).json({ message: 'Company ID is required' });
      }
      
      // Check if user has allowed role in the company
      const userCompany = await UserCompany.findOne({
        where: {
          UserId: req.user.id,
          CompanyId: companyId
        }
      });
      
      if (!userCompany || !allowedRoles.includes(userCompany.role)) {
        return res.status(403).json({ 
          message: `Access restricted to users with roles: ${allowedRoles.join(', ')}` 
        });
      }
      
      // Add user's role in this company to the request
      req.userCompanyRole = userCompany.role;
      
      next();
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};

module.exports = {
  adminOnly,
  ownerOnly,
  companyMemberOnly,
  hasRole
};
