import 'dotenv/config';
import app from './app.js';
import { db } from './config/database.js';
import { kafkaProducer } from './config/kafka.js';

const PORT = process.env.AUTH_API_PORT || 5001;

const start = async () => {
  try {
    // Test database connection
    await db.raw('SELECT 1');
    console.log('Database connected');

    // Connect Kafka producer
    await kafkaProducer.connect();
    
    app.listen(PORT, () => {
      console.log(`Auth API running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down...');
  await kafkaProducer.disconnect();
  await db.destroy();
  process.exit(0);
});

start();
