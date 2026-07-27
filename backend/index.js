const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const path = require('path');

// ── Startup Guard: fail fast if JWT_SECRET not set (Fixes C-004) ──────────────
if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is not set. Server will not start.');
  process.exit(1);
}

const app = express();

// ── Security Headers via Helmet (Fixes M-004) ─────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false
}));

// ── CORS: Explicit origin allowlist (Fixes H-003) ─────────────────────────────
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:8081,exp://localhost:8081').split(',');

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl in dev)
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS_BLOCKED: Origin not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ── Rate Limiting (Fixes H-002) ───────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    error: 'RATE_LIMITED',
    message: 'Too many requests. Please try again after 15 minutes.'
  }
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    error: 'RATE_LIMITED',
    message: 'Too many requests. Please slow down.'
  }
});

// ── Body Limits: 1MB global (Fixes H-006) ─────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));

// ── Static Images ──────────────────────────────────────────────────────────────
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// ── Routes ────────────────────────────────────────────────────────────────────
const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipeRoutes');
const communityRoutes = require('./routes/communityRoutes');
const ayurvedaRoutes = require('./routes/ayurvedaRoutes');

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/recipes', apiLimiter, recipeRoutes);
app.use('/api/community', apiLimiter, communityRoutes);
app.use('/api/ayurveda', apiLimiter, ayurvedaRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'The Smart Chef cloud backend is operational!' });
});

// ── Global Error Handler: never expose internals (Fixes M-001) ────────────────
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.message);
  res.status(500).json({ status: 'error', error: 'SERVER_ERROR', message: 'Internal server error.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  // Removed hardcoded LAN IP (Fixes M-010)
  console.log(`Server running on port ${PORT}`);
  console.log('Local file-based database active under backend/data/');
});
