import { Router } from 'express';
import { userService } from '../services/userService.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get all users (admin only)
router.get('/', requireRole('admin'), async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const result = await userService.getAll({ page, limit, search }, req.correlationId);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
});

// Get user by ID
router.get('/:id', async (req, res, next) => {
  try {
    // Users can only view their own profile unless admin
    if (req.params.id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { code: 'AUTH_004', message: 'Insufficient permissions' },
      });
    }
    
    const result = await userService.getById(req.params.id, req.correlationId);
    res.json({ success: true, data: result.data });
  } catch (error) {
    next(error);
  }
});

// Update user
router.put('/:id', async (req, res, next) => {
  try {
    // Users can only update their own profile unless admin
    if (req.params.id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { code: 'AUTH_004', message: 'Insufficient permissions' },
      });
    }
    
    const result = await userService.update(req.params.id, req.body, req.correlationId);
    res.json({ success: true, data: result.data });
  } catch (error) {
    next(error);
  }
});

// Delete user (admin only)
router.delete('/:id', requireRole('admin'), async (req, res, next) => {
  try {
    await userService.delete(req.params.id, req.correlationId);
    res.json({ success: true, data: { message: 'User deleted successfully' } });
  } catch (error) {
    next(error);
  }
});

export default router;
