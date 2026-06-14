#!/bin/bash
# Create Kafka topics for local development

KAFKA_BROKER=${KAFKA_BROKER:-localhost:9092}

# Create topics
kafka-topics.sh --create --if-not-exists \
  --bootstrap-server $KAFKA_BROKER \
  --topic auth.events \
  --partitions 3 \
  --replication-factor 1

kafka-topics.sh --create --if-not-exists \
  --bootstrap-server $KAFKA_BROKER \
  --topic user.events \
  --partitions 3 \
  --replication-factor 1

kafka-topics.sh --create --if-not-exists \
  --bootstrap-server $KAFKA_BROKER \
  --topic item.events \
  --partitions 6 \
  --replication-factor 1

echo "Kafka topics created successfully"
