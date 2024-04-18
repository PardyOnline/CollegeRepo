const User = require('../models/User');
const bcrypt = require('bcryptjs');
const sessions = require('express-session');

// Middleware to protect routes
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/signin');
  }
  next();
};

// Middleware to check user role
const requireRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).send('You do not have permission to perform this action.');
  }
  next();
};

module.exports = { requireAuth, requireRole };
