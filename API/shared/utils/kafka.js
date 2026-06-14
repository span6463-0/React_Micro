import { Kafka } from 'kafkajs';
import { logger } from './logger.js';

export class KafkaProducer {
  constructor(clientId, brokers) {
    this.kafka = new Kafka({
      clientId,
      brokers: brokers.split(','),
    });
    this.producer = this.kafka.producer();
    this.connected = false;
  }

  async connect() {
    if (!this.connected) {
      await this.producer.connect();
      this.connected = true;
      logger.info('Kafka producer connected');
    }
  }

  async disconnect() {
    if (this.connected) {
      await this.producer.disconnect();
      this.connected = false;
      logger.info('Kafka producer disconnected');
    }
  }

  async send(topic, key, value) {
    if (!this.connected) {
      await this.connect();
    }
    
    await this.producer.send({
      topic,
      messages: [
        {
          key,
          value: JSON.stringify(value),
          timestamp: Date.now().toString(),
        },
      ],
    });
    
    logger.debug({ message: 'Kafka message sent', topic, key });
  }
}
