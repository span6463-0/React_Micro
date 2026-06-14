import { Kafka } from 'kafkajs';
import { config } from './index.js';

const kafka = new Kafka({
  clientId: config.kafka.clientId,
  brokers: config.kafka.brokers.split(','),
});

export const kafkaProducer = kafka.producer();

export const publishEvent = async (topic, key, data) => {
  await kafkaProducer.send({
    topic,
    messages: [{ key, value: JSON.stringify({ ...data, timestamp: new Date().toISOString() }) }],
  });
};
