const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { Op } = require('sequelize');
const { User, Role, Company, UserCompany, sequelize } = require('../models');
const logger = require('../utils/logger');
const emailService = require('../services/email.service');

/**
 * Authentication controller with user registration, login and token management
 */
const authController = {
  /**
   * Register a new user
   */
  register: async (req, res, next) => {
    const transaction = await sequelize.transaction();
    
    try {
      const { firstName, lastName, email, password, companyName, companySlug } = req.body;
      
      // Check if user already exists
      const existingUser = await User.findOne({ 
        where: { email },
        transaction
      });
      
      if (existingUser) {
        await transaction.rollback();
        return res.status(409).json({ message: 'Email already registered' });
      }
      
      // Get user role (default to 'user')
      const userRole = await Role.findOne({
        where: { name: 'user' },
        transaction
      });
      
      if (!userRole) {
        await transaction.rollback();
        return res.status(500).json({ message: 'Role not found' });
      }
      
      // Generate email verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      
      // Create user
      const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        RoleId: userRole.id,
        emailVerificationToken: verificationToken,
        status: 'pending'
      }, { transaction });
      
      // If company name provided, create company and add user as owner
      if (companyName) {
        const company = await Company.create({
          name: companyName,
          slug: companySlug || companyName.toLowerCase().replace(/\s+/g, '-')
        }, { transaction });
        
        // Associate user with company
        await UserCompany.create({
          UserId: user.id,
          CompanyId: company.id,
          role: 'owner',
          isDefault: true
        }, { transaction });
      }
      
      await transaction.commit();
      
      // Send verification email
      await emailService.sendVerificationEmail(user.email, user.firstName, verificationToken);
      
      logger.info(`User registered: ${user.email}`);
      
      res.status(201).json({
        message: 'Registration successful. Please verify your email to continue.',
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      });
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  },
  
  /**
   * User login
   */
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      
      // Find user with role
      const user = await User.findOne({
        where: { email },
        include: [
          {
            model: Role,
            attributes: ['name']
          }
        ]
      });
      
      // Check if user exists
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      
      // Check if user is active
      if (user.status === 'pending') {
        return res.status(403).json({ message: 'Please verify your email to login' });
      }
      
      if (user.status === 'inactive') {
        return res.status(403).json({ message: 'Your account has been deactivated' });
      }
      
      // Validate password
      const isPasswordValid = await user.validatePassword(password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      
      // Get user's companies
      const userCompanies = await UserCompany.findAll({
        where: { UserId: user.id },
        include: [
          {
            model: Company,
            attributes: ['id', 'name', 'slug', 'logo']
          }
        ]
      });
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, role: user.Role.name },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION }
      );
      
      // Update last login
      await user.update({ lastLogin: new Date() });
      
      logger.info(`User logged in: ${user.email}`);
      
      res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.Role.name,
          profilePicture: user.profilePicture,
          companies: userCompanies.map(uc => ({
            id: uc.Company.id,
            name: uc.Company.name,
            slug: uc.Company.slug,
            logo: uc.Company.logo,
            role: uc.role,
            isDefault: uc.isDefault
          }))
        }
      });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Verify email
   */
  verifyEmail: async (req, res, next) => {
    try {
      const { token } = req.params;
      
      // Find user with token
      const user = await User.findOne({
        where: { emailVerificationToken: token }
      });
      
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired verification token' });
      }
      
      // Update user
      await user.update({
        emailVerificationToken: null,
        emailVerified: true,
        status: 'active'
      });
      
      logger.info(`User verified email: ${user.email}`);
      
      res.status(200).json({ message: 'Email verification successful. You can now login.' });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Request password reset
   */
  forgotPassword: async (req, res, next) => {
    try {
      const { email } = req.body;
      
      // Find user by email
      const user = await User.findOne({ where: { email } });
      
      // Always return success response regardless of whether user exists (security)
      if (!user) {
        return res.status(200).json({ message: 'If your email is registered, you will receive password reset instructions.' });
      }
      
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpires = new Date();
      resetExpires.setHours(resetExpires.getHours() + 1); // 1 hour expiry
      
      // Update user with reset token
      await user.update({
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires
      });
      
      // Send password reset email
      await emailService.sendPasswordResetEmail(user.email, user.firstName, resetToken);
      
      logger.info(`Password reset requested for: ${user.email}`);
      
      res.status(200).json({ message: 'If your email is registered, you will receive password reset instructions.' });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Reset password
   */
  resetPassword: async (req, res, next) => {
    try {
      const { token } = req.params;
      const { password } = req.body;
      
      // Find user with valid token
      const user = await User.findOne({
        where: {
          passwordResetToken: token,
          passwordResetExpires: { [Op.gt]: new Date() }
        }
      });
      
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired reset token' });
      }
      
      // Update password and clear reset token
      await user.update({
        password, // Will be hashed in beforeUpdate hook
        passwordResetToken: null,
        passwordResetExpires: null
      });
      
      logger.info(`Password reset successful for: ${user.email}`);
      
      res.status(200).json({ message: 'Password reset successful. You can now login with your new password.' });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Get current user profile
   */
  getCurrentUser: async (req, res, next) => {
    try {
      // User is attached to request from auth middleware
      const user = req.user;
      
      // Get user's companies
      const userCompanies = await UserCompany.findAll({
        where: { UserId: user.id },
        include: [
          {
            model: Company,
            attributes: ['id', 'name', 'slug', 'logo']
          }
        ]
      });
      
      res.status(200).json({
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.Role.name,
          profilePicture: user.profilePicture,
          preferences: user.preferences,
          companies: userCompanies.map(uc => ({
            id: uc.Company.id,
            name: uc.Company.name,
            slug: uc.Company.slug,
            logo: uc.Company.logo,
            role: uc.role,
            isDefault: uc.isDefault
          }))
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
