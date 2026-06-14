import { Router } from 'express';
import { itemService } from '../services/itemService.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = Router();

// Get all items (public, but with more data if authenticated)
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, status, search } = req.query;
    const result = await itemService.getAll(
      { page, limit, category, status, search },
      req.correlationId
    );
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
});

// Get item by ID
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const result = await itemService.getById(req.params.id, req.correlationId);
    res.json({ success: true, data: result.data });
  } catch (error) {
    next(error);
  }
});

// Create item (authenticated)
router.post('/', authenticate, async (req, res, next) => {
  try {
    const result = await itemService.create(
      { ...req.body, createdBy: req.user.id },
      req.correlationId
    );
    res.status(201).json({ success: true, data: result.data });
  } catch (error) {
    next(error);
  }
});

// Update item (authenticated)
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const result = await itemService.update(
      req.params.id,
      { ...req.body, updatedBy: req.user.id },
      req.correlationId
    );
    res.json({ success: true, data: result.data });
  } catch (error) {
    next(error);
  }
});

// Delete item (authenticated)
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    await itemService.delete(req.params.id, req.correlationId);
    res.json({ success: true, data: { message: 'Item deleted successfully' } });
  } catch (error) {
    next(error);
  }
});

// Get item statistics (authenticated)
router.get('/stats/overview', authenticate, async (req, res, next) => {
  try {
    const result = await itemService.getStats(req.user.id, req.correlationId);
    res.json({ success: true, data: result.data });
  } catch (error) {
    next(error);
  }
});

export default router;
