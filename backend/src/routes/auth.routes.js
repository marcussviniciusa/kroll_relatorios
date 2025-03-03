const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth');

// Placeholder for controller (to be implemented properly)
const authController = {
  login: (req, res) => {
    res.status(200).json({ 
      message: 'Login successful', 
      token: 'sample-jwt-token',
      user: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin'
      }
    });
  },
  register: (req, res) => {
    res.status(201).json({ 
      message: 'User registered successfully',
      user: {
        id: '123e4567-e89b-12d3-a456-426614174001',
        email: req.body.email,
        name: req.body.name
      }
    });
  },
  forgotPassword: (req, res) => {
    res.status(200).json({ message: 'Password reset link sent to your email' });
  },
  resetPassword: (req, res) => {
    res.status(200).json({ message: 'Password reset successful' });
  },
  me: (req, res) => {
    res.status(200).json({
      user: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin'
      }
    });
  }
};

// Auth routes
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
  authController.login
);

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
  authController.register
);

router.post(
  '/forgot-password',
  [
    body('email').isEmail().withMessage('Please provide a valid email')
  ],
  authController.forgotPassword
);

router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Token is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
  authController.resetPassword
);

router.get('/me', authMiddleware, authController.me);

module.exports = router;
