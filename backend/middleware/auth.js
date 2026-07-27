/**
 * JWT Authentication Middleware
 * Fixes: C-002 (Missing auth middleware), TC-INPUT-007, TC-INPUT-008, TC-AUTH-015
 *
 * Usage: router.post('/create', authMiddleware, handler)
 * After this middleware: req.user = { id, username, email }
 */
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // Extract token from Authorization: Bearer <token>
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        error: 'AUTH_REQUIRED',
        message: 'Authentication required. Please log in.'
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        status: 'error',
        error: 'TOKEN_MISSING',
        message: 'Token not provided.'
      });
    }

    // Verify token — explicit algorithm prevents alg:none attacks
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256']
    });

    // Load full user from DB so we have username, email
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        status: 'error',
        error: 'USER_NOT_FOUND',
        message: 'User associated with this token no longer exists.'
      });
    }

    // Attach verified identity to request — NEVER trust req.body for identity
    req.user = {
      id: user._id.toString(),
      username: user.username,
      email: user.email
    };

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        error: 'TOKEN_EXPIRED',
        message: 'Your session has expired. Please log in again.'
      });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({
        status: 'error',
        error: 'INVALID_TOKEN',
        message: 'Invalid authentication token.'
      });
    }
    // Generic — no internal details exposed
    return res.status(401).json({
      status: 'error',
      error: 'AUTH_FAILED',
      message: 'Authentication failed.'
    });
  }
};

module.exports = authMiddleware;
