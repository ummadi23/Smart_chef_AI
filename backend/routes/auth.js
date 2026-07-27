const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// In-memory OTP store: { email -> { otp, expiresAt } }
// In production, use Redis or a DB collection instead.
const resetOtpStore = new Map();

// ── Helper: generic error response (never expose internals, Fixes M-001) ──────
const serverError = (res, context, err) => {
  console.error(`[${context}]`, err);
  res.status(500).json({ status: 'error', error: 'SERVER_ERROR', message: 'Internal server error.' });
};

// ── Helper: validate email format ─────────────────────────────────────────────
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ── Helper: JWT sign with explicit algorithm (Fixes C-004, M-003) ─────────────
const signToken = (userId, role = 'user') => {
  return jwt.sign(
    { id: userId, role, iss: 'smart-chef-api', aud: 'smart-chef-app' },
    process.env.JWT_SECRET,          // No fallback — startup guard ensures this exists
    { expiresIn: '1d', algorithm: 'HS256' }
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. SIGN UP
// ─────────────────────────────────────────────────────────────────────────────
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, preferences } = req.body;

    if (!username || !username.trim()) {
      return res.status(400).json({ error: 'USERNAME_REQUIRED', message: 'Username is required.' });
    }
    // Validate email format (Fixes TC-INPUT-001)
    if (!email || !isValidEmail(email.trim())) {
      return res.status(400).json({ error: 'INVALID_EMAIL', message: 'A valid email address is required.' });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'WEAK_PASSWORD', message: 'Password must be at least 8 characters.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      return res.status(400).json({ error: 'EMAIL_EXISTS', message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const initialPrefs = {
      ...(preferences || {}),
      onboardingComplete: preferences?.onboardingComplete || false,
    };

    const newUser = new User({
      username: username.trim(),
      email: cleanEmail,
      password: hashedPassword,
      preferences: initialPrefs,
    });

    await newUser.save();

    const token = signToken(newUser._id);

    res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        preferences: newUser.preferences,
      }
    });

  } catch (error) {
    serverError(res, 'signup', error);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. LOG IN
// ─────────────────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'EMAIL_REQUIRED', message: 'Please enter your email address.' });
    }
    if (!password) {
      return res.status(400).json({ error: 'PASSWORD_REQUIRED', message: 'Please enter your password.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    // Use generic message for both missing user & wrong password (Fixes TC-AUTH-005, TC-AUTH-006)
    if (!user) {
      return res.status(400).json({ error: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' });
    }

    const token = signToken(user._id);

    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        preferences: { ...(user.preferences || {}), onboardingComplete: true },
      }
    });

  } catch (error) {
    serverError(res, 'login', error);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. GOOGLE SIGN-IN
// ─────────────────────────────────────────────────────────────────────────────
router.post('/google', async (req, res) => {
  try {
    const { email, name, googleId } = req.body;

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: 'EMAIL_REQUIRED', message: 'Google account email is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: cleanEmail });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      // Use a cryptographically random placeholder password (Fixes H-005)
      const randomPlaceholder = crypto.randomBytes(32).toString('hex');
      const hashedPassword = await bcrypt.hash(randomPlaceholder, 12);

      user = new User({
        username: name || cleanEmail.split('@')[0],
        email: cleanEmail,
        password: hashedPassword,
        googleId: googleId || null,
        preferences: { onboardingComplete: false },
      });
      await user.save();
    }

    const token = signToken(user._id);

    res.json({
      message: 'Google Authentication successful!',
      token,
      isNewUser,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        preferences: user.preferences || { onboardingComplete: !isNewUser },
      }
    });
  } catch (error) {
    serverError(res, 'google-auth', error);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. UPDATE USER PREFERENCES — requires authentication (Fixes C-002, TC-AUTH-012)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/update-preferences', authMiddleware, async (req, res) => {
  try {
    // Identity from verified JWT, never from body (Fixes TC-AUTH-013 IDOR)
    const userId = req.user.id;
    const { preferences } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'USER_NOT_FOUND', message: 'User not found.' });
    }

    user.preferences = {
      ...(user.preferences || {}),
      ...(preferences || {}),
      onboardingComplete: true
    };

    await user.save();

    res.json({
      message: 'Preferences updated successfully!',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        preferences: user.preferences
      }
    });
  } catch (error) {
    serverError(res, 'update-preferences', error);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. REQUEST PASSWORD RESET OTP (Fixes C-003 — Step 1 of 2)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !isValidEmail(email.trim())) {
      return res.status(400).json({ error: 'INVALID_EMAIL', message: 'A valid email address is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    // Always respond success to prevent user enumeration
    if (!user) {
      return res.json({ message: 'If this email exists, a reset code has been sent.' });
    }

    // Generate 6-digit OTP with 15-min expiry
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000;

    resetOtpStore.set(cleanEmail, { otp, expiresAt });

    // In production: send otp via email with nodemailer
    // For development: log to server console only (never to client)
    console.log(`[DEV ONLY] Password reset OTP for ${cleanEmail}: ${otp}`);

    res.json({ message: 'If this email exists, a reset code has been sent.' });
  } catch (error) {
    serverError(res, 'forgot-password', error);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. RESET PASSWORD with OTP verification (Fixes C-003 — Step 2 of 2)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !isValidEmail(email.trim())) {
      return res.status(400).json({ error: 'INVALID_EMAIL', message: 'A valid email address is required.' });
    }
    if (!otp) {
      return res.status(400).json({ error: 'OTP_REQUIRED', message: 'Reset code is required.' });
    }
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: 'WEAK_PASSWORD', message: 'New password must be at least 8 characters.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Verify OTP
    const record = resetOtpStore.get(cleanEmail);
    if (!record) {
      return res.status(400).json({ error: 'INVALID_OTP', message: 'Invalid or expired reset code. Request a new one.' });
    }
    if (Date.now() > record.expiresAt) {
      resetOtpStore.delete(cleanEmail);
      return res.status(400).json({ error: 'OTP_EXPIRED', message: 'Reset code has expired. Please request a new one.' });
    }
    if (record.otp !== otp.toString()) {
      return res.status(400).json({ error: 'INVALID_OTP', message: 'Incorrect reset code.' });
    }

    // OTP valid — consume it (single use)
    resetOtpStore.delete(cleanEmail);

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ error: 'USER_NOT_FOUND', message: 'Account not found.' });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.json({ message: 'Password updated successfully! Please log in with your new password.', success: true });
  } catch (error) {
    serverError(res, 'reset-password', error);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. GOOGLE AUTHENTICATION / SIGN-IN
// ─────────────────────────────────────────────────────────────────────────────
router.post('/google', async (req, res) => {
  try {
    const { email, name, googleId } = req.body;

    if (!email || !isValidEmail(email.trim())) {
      return res.status(400).json({ error: 'INVALID_EMAIL', message: 'Valid email is required for Google Sign-In.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const username = name || cleanEmail.split('@')[0];

    let user = await User.findOne({ email: cleanEmail });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      const dummyPassword = await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 12);
      user = new User({
        username: username.trim(),
        email: cleanEmail,
        password: dummyPassword,
        googleId: googleId || `google_${Date.now()}`,
        preferences: { onboardingComplete: false }
      });
      await user.save();
    }

    const token = signToken(user._id, user.role || 'user');

    res.json({
      message: isNewUser ? 'Google account registered successfully!' : 'Google login successful!',
      token,
      isNewUser,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        preferences: user.preferences || {}
      }
    });

  } catch (error) {
    serverError(res, 'google-auth', error);
  }
});

module.exports = router;