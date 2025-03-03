const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth');

// Placeholder for controller (to be implemented properly)
const userController = {
  getAllUsers: (req, res) => {
    res.status(200).json({ 
      users: [
        { id: '123e4567-e89b-12d3-a456-426614174000', name: 'User 1', email: 'user1@example.com', role: 'admin' },
        { id: '123e4567-e89b-12d3-a456-426614174001', name: 'User 2', email: 'user2@example.com', role: 'editor' },
        { id: '123e4567-e89b-12d3-a456-426614174002', name: 'User 3', email: 'user3@example.com', role: 'viewer' }
      ]
    });
  },
  getUserById: (req, res) => {
    res.status(200).json({ 
      user: { 
        id: req.params.id, 
        name: 'Sample User', 
        email: 'user@example.com',
        role: 'admin'
      }
    });
  },
  updateUser: (req, res) => {
    res.status(200).json({ 
      message: 'User updated successfully',
      user: {
        id: req.params.id,
        ...req.body
      }
    });
  },
  deleteUser: (req, res) => {
    res.status(200).json({ message: 'User deleted successfully' });
  },
  updateProfile: (req, res) => {
    res.status(200).json({ 
      message: 'Profile updated successfully',
      user: {
        id: req.user.id,
        ...req.body
      }
    });
  },
  changePassword: (req, res) => {
    res.status(200).json({ message: 'Password changed successfully' });
  }
};

// User routes
router.get('/', authMiddleware, userController.getAllUsers);
router.get('/:id', authMiddleware, userController.getUserById);
router.put('/:id', 
  [
    authMiddleware,
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Please provide a valid email'),
    body('role').optional().isIn(['admin', 'editor', 'viewer']).withMessage('Invalid role')
  ],
  userController.updateUser
);
router.delete('/:id', authMiddleware, userController.deleteUser);

// Profile routes
router.put('/profile/update', 
  [
    authMiddleware,
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Please provide a valid email')
  ],
  userController.updateProfile
);
router.post('/profile/change-password',
  [
    authMiddleware,
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
  ],
  userController.changePassword
);

module.exports = router;
