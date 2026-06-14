import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/database.js';
import { config } from '../config/index.js';
import { publishEvent } from '../config/kafka.js';
import { validateLogin, validateRegister } from '../validators/auth.validator.js';

const router = Router();

// Register
router.post('/register', async (req, res, next) => {
  try {
    const { error, value } = validateRegister(req.body);
    if (error) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION', message: error.message } });
    }

    const { name, email, password } = value;

    // Check if user exists
    const existing = await db('users_auth').where({ email }).first();
    if (existing) {
      return res.status(409).json({ success: false, error: { code: 'USER_EXISTS', message: 'Email already registered' } });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    const userId = uuidv4();

    // Create user
    await db('users_auth').insert({
      id: userId,
      email,
      password_hash: passwordHash,
    });

    // Publish event
    await publishEvent('auth.events', userId, { type: 'USER_REGISTERED', userId, email, name });

    res.status(201).json({ success: true, data: { userId, email } });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { error, value } = validateLogin(req.body);
    if (error) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION', message: error.message } });
    }

    const { email, password } = value;

    // Find user
    const user = await db('users_auth').where({ email }).first();
    if (!user) {
      return res.status(401).json({ success: false, error: { code: 'AUTH_FAILED', message: 'Invalid credentials' } });
    }

    // Verify password
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ success: false, error: { code: 'AUTH_FAILED', message: 'Invalid credentials' } });
    }

    // Generate tokens
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role || 'user' }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
    const refreshToken = uuidv4();

    // Store refresh token
    await db('refresh_tokens').insert({
      id: uuidv4(),
      user_id: user.id,
      token: refreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // Publish event
    await publishEvent('auth.events', user.id, { type: 'USER_LOGGED_IN', userId: user.id });

    res.json({
      success: true,
      data: {
        token,
        refreshToken,
        user: { id: user.id, email: user.email, role: user.role || 'user' },
      },
    });
  } catch (error) {
    next(error);
  }
});

// Refresh token
router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ success: false, error: { code: 'MISSING_TOKEN', message: 'Refresh token required' } });
    }

    // Find valid refresh token
    const tokenRecord = await db('refresh_tokens')
      .where({ token: refreshToken })
      .where('expires_at', '>', new Date())
      .first();

    if (!tokenRecord) {
      return res.status(401).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Invalid or expired refresh token' } });
    }

    // Get user
    const user = await db('users_auth').where({ id: tokenRecord.user_id }).first();

    // Generate new tokens
    const newToken = jwt.sign({ id: user.id, email: user.email, role: user.role || 'user' }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
    const newRefreshToken = uuidv4();

    // Replace refresh token
    await db('refresh_tokens').where({ id: tokenRecord.id }).delete();
    await db('refresh_tokens').insert({
      id: uuidv4(),
      user_id: user.id,
      token: newRefreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.json({ success: true, data: { token: newToken, refreshToken: newRefreshToken } });
  } catch (error) {
    next(error);
  }
});

// Logout
router.post('/logout', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await db('refresh_tokens').where({ token: refreshToken }).delete();
    }
    res.json({ success: true, data: { message: 'Logged out' } });
  } catch (error) {
    next(error);
  }
});

export default router;
