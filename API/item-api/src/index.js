import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import knex from 'knex';
import { Kafka } from 'kafkajs';
import { v4 as uuidv4 } from 'uuid';
import Joi from 'joi';

const app = express();
const PORT = process.env.ITEM_API_PORT || 5003;

// Database
const db = knex({
  client: 'pg',
  connection: {
    host: process.env.ITEM_DB_HOST || 'localhost',
    port: Number(process.env.ITEM_DB_PORT) || 5435,
    database: process.env.ITEM_DB_NAME || 'item_db',
    user: process.env.ITEM_DB_USER || 'postgres',
    password: process.env.ITEM_DB_PASSWORD || 'postgres',
  },
  pool: { min: 2, max: 10 },
});

// Kafka
const kafka = new Kafka({
  clientId: 'item-api',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
});
const producer = kafka.producer();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Validation
const itemSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  description: Joi.string().allow(''),
  category: Joi.string().required(),
  price: Joi.number().positive().required(),
  sku: Joi.string().required(),
  stock: Joi.number().integer().min(0).default(0),
  status: Joi.string().valid('Draft', 'Active', 'Archived').default('Draft'),
  created_by: Joi.string().uuid(),
  updated_by: Joi.string().uuid(),
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'healthy', service: 'item-api' }));

// Get all items
app.get('/items', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, status, search } = req.query;
    let query = db('items');
    
    if (category) query = query.where({ category });
    if (status) query = query.where({ status });
    if (search) query = query.where('name', 'ilike', `%${search}%`);
    
    const offset = (page - 1) * limit;
    const [items, [{ count }]] = await Promise.all([
      query.clone().select('*').limit(limit).offset(offset).orderBy('created_at', 'desc'),
      query.clone().count(),
    ]);
    
    res.json({ data: items, meta: { page: Number(page), limit: Number(limit), total: Number(count) } });
  } catch (error) {
    next(error);
  }
});

// Get item by ID
app.get('/items/:id', async (req, res, next) => {
  try {
    const item = await db('items').where({ id: req.params.id }).first();
    if (!item) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Item not found' } });
    }
    res.json({ data: item });
  } catch (error) {
    next(error);
  }
});

// Create item
app.post('/items', async (req, res, next) => {
  try {
    const { error, value } = itemSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION', message: error.message } });
    }
    
    const id = uuidv4();
    const [item] = await db('items').insert({ id, ...value }).returning('*');
    
    await producer.send({
      topic: 'item.events',
      messages: [{ key: id, value: JSON.stringify({ type: 'ITEM_CREATED', itemId: id, data: item }) }],
    });
    
    res.status(201).json({ data: item });
  } catch (error) {
    next(error);
  }
});

// Update item
app.put('/items/:id', async (req, res, next) => {
  try {
    const { error, value } = itemSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION', message: error.message } });
    }
    
    const [item] = await db('items').where({ id: req.params.id }).update({ ...value, updated_at: new Date() }).returning('*');
    
    if (!item) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Item not found' } });
    }
    
    await producer.send({
      topic: 'item.events',
      messages: [{ key: req.params.id, value: JSON.stringify({ type: 'ITEM_UPDATED', itemId: req.params.id, data: item }) }],
    });
    
    res.json({ data: item });
  } catch (error) {
    next(error);
  }
});

// Delete item
app.delete('/items/:id', async (req, res, next) => {
  try {
    const deleted = await db('items').where({ id: req.params.id }).delete();
    if (!deleted) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Item not found' } });
    }
    
    await producer.send({
      topic: 'item.events',
      messages: [{ key: req.params.id, value: JSON.stringify({ type: 'ITEM_DELETED', itemId: req.params.id }) }],
    });
    
    res.json({ data: { message: 'Item deleted' } });
  } catch (error) {
    next(error);
  }
});

// Get stats
app.get('/items/stats/:userId', async (req, res, next) => {
  try {
    const [total] = await db('items').count();
    const [active] = await db('items').where({ status: 'Active' }).count();
    const [draft] = await db('items').where({ status: 'Draft' }).count();
    
    res.json({
      data: {
        total: Number(total.count),
        active: Number(active.count),
        draft: Number(draft.count),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, error: { code: 'ERROR', message: 'Internal error' } });
});

const start = async () => {
  await db.raw('SELECT 1');
  await producer.connect();
  app.listen(PORT, () => console.log(`Item API running on port ${PORT}`));
};

start().catch(console.error);
