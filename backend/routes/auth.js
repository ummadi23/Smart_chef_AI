const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. SIGN UP ROUTE
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, preferences } = req.body;

    if (!username || !username.trim()) {
      return res.status(400).json({ error: 'USERNAME_REQUIRED', message: 'Username is required.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'EMAIL_REQUIRED', message: 'Email address is required.' });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'WEAK_PASSWORD', message: 'Password must be at least 8 characters with letters and numbers.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user email already exists
    let userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      return res.status(400).json({
        error: 'EMAIL_EXISTS',
        message: 'An account with this email already exists. Please log in instead.'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Initial user preferences with onboardingComplete flag
    const initialPrefs = {
      ...(preferences || {}),
      onboardingComplete: preferences?.onboardingComplete || false,
    };

    // Create user document
    const newUser = new User({
      username: username.trim(),
      email: cleanEmail,
      password: hashedPassword,
      preferences: initialPrefs,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || 'SECRET_SESSION_KEY', { expiresIn: '7d' });

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
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Server error during registration: ' + error.message });
  }
});

// 2. LOG IN ROUTE
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

    // Find user
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(400).json({
        error: 'EMAIL_NOT_FOUND',
        message: 'No account found with this email. Please create an account first.'
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        error: 'INVALID_PASSWORD',
        message: 'Incorrect email or password. Please try again.'
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'SECRET_SESSION_KEY', { expiresIn: '7d' });

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
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Server error during login: ' + error.message });
  }
});

// 3. GOOGLE SIGN-IN ROUTE
router.post('/google', async (req, res) => {
  try {
    const { email, name, googleId } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'EMAIL_REQUIRED', message: 'Google account email is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: cleanEmail });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      // Create new user via Google
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(googleId || 'GOOGLE_AUTH_SECRET', salt);

      user = new User({
        username: name || email.split('@')[0],
        email: cleanEmail,
        password: hashedPassword,
        googleId,
        preferences: { onboardingComplete: false },
      });
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'SECRET_SESSION_KEY', { expiresIn: '7d' });

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
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Google auth server error: ' + error.message });
  }
});

// 4. UPDATE USER PREFERENCES ROUTE
router.post('/update-preferences', async (req, res) => {
  try {
    const { userId, preferences } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'USER_ID_REQUIRED', message: 'User ID is required.' });
    }

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
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Server error updating preferences: ' + error.message });
  }
});

// 5. RESET / FORGOT PASSWORD ROUTE
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'EMAIL_REQUIRED', message: 'Email address is required.' });
    }
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: 'WEAK_PASSWORD', message: 'New password must be at least 8 characters long.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({ error: 'EMAIL_NOT_FOUND', message: 'No account found with this email address.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({
      message: 'Password updated successfully! Please log in with your new password.',
      success: true
    });
  } catch (error) {
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Server error resetting password: ' + error.message });
  }
});

module.exports = router;