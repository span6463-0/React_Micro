import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import knex from 'knex';
import { Kafka } from 'kafkajs';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.USER_API_PORT || 3002;

// Database
const db = knex({
  client: 'pg',
  connection: {
    host: process.env.USER_DB_HOST || 'localhost',
    database: process.env.USER_DB_NAME || 'user_db',
    user: process.env.USER_DB_USER || 'postgres',
    password: process.env.USER_DB_PASSWORD || 'postgres',
  },
  pool: { min: 2, max: 10 },
});

// Kafka
const kafka = new Kafka({
  clientId: 'user-api',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
});
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'user-api-group' });

app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => res.json({ status: 'healthy', service: 'user-api' }));

// Get all users
app.get('/users', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    let query = db('users').select('id', 'name', 'email', 'role', 'created_at');
    
    if (search) {
      query = query.where('name', 'ilike', `%${search}%`).orWhere('email', 'ilike', `%${search}%`);
    }
    
    const offset = (page - 1) * limit;
    const [users, [{ count }]] = await Promise.all([
      query.limit(limit).offset(offset),
      db('users').count(),
    ]);
    
    res.json({ data: users, meta: { page: Number(page), limit: Number(limit), total: Number(count) } });
  } catch (error) {
    next(error);
  }
});

// Get user by ID
app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await db('users').where({ id: req.params.id }).first();
    if (!user) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
    }
    res.json({ data: user });
  } catch (error) {
    next(error);
  }
});

// Update user
app.put('/users/:id', async (req, res, next) => {
  try {
    const { name, phone, bio } = req.body;
    const updated = await db('users').where({ id: req.params.id }).update({ name, phone, bio, updated_at: new Date() }).returning('*');
    
    if (updated.length === 0) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
    }
    
    await producer.send({
      topic: 'user.events',
      messages: [{ key: req.params.id, value: JSON.stringify({ type: 'USER_UPDATED', userId: req.params.id, data: updated[0] }) }],
    });
    
    res.json({ data: updated[0] });
  } catch (error) {
    next(error);
  }
});

// Delete user
app.delete('/users/:id', async (req, res, next) => {
  try {
    const deleted = await db('users').where({ id: req.params.id }).delete();
    if (!deleted) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
    }
    
    await producer.send({
      topic: 'user.events',
      messages: [{ key: req.params.id, value: JSON.stringify({ type: 'USER_DELETED', userId: req.params.id }) }],
    });
    
    res.json({ data: { message: 'User deleted' } });
  } catch (error) {
    next(error);
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, error: { code: 'ERROR', message: 'Internal error' } });
});

// Kafka consumer for auth events
const startConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'auth.events', fromBeginning: false });
  
  await consumer.run({
    eachMessage: async ({ message }) => {
      const event = JSON.parse(message.value.toString());
      
      if (event.type === 'USER_REGISTERED') {
        await db('users').insert({
          id: event.userId,
          name: event.name,
          email: event.email,
          role: 'user',
        });
        console.log('User profile created for:', event.userId);
      }
    },
  });
};

const start = async () => {
  await db.raw('SELECT 1');
  await producer.connect();
  await startConsumer();
  app.listen(PORT, () => console.log(`User API running on port ${PORT}`));
};

start().catch(console.error);
