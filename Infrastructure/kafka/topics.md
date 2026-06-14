# Kafka Topics Configuration

## Topics

### auth.events

- **Purpose**: Authentication-related events
- **Partitions**: 3
- **Replication Factor**: 2 (production)
- **Retention**: 7 days

Events:

- USER_REGISTERED
- USER_LOGGED_IN
- USER_LOGGED_OUT
- PASSWORD_CHANGED
- TOKEN_REFRESHED

### user.events

- **Purpose**: User management events
- **Partitions**: 3
- **Replication Factor**: 2 (production)
- **Retention**: 30 days

Events:

- USER_CREATED
- USER_UPDATED
- USER_DELETED
- ROLE_ASSIGNED
- ROLE_REMOVED

### item.events

- **Purpose**: Item management events
- **Partitions**: 6
- **Replication Factor**: 2 (production)
- **Retention**: 30 days

Events:

- ITEM_CREATED
- ITEM_UPDATED
- ITEM_DELETED
- STOCK_UPDATED
- STATUS_CHANGED

## Consumer Groups

| Group ID           | Topics      | Description                        |
| ------------------ | ----------- | ---------------------------------- |
| user-api-group     | auth.events | Sync user profiles on registration |
| item-api-group     | user.events | Track item ownership changes       |
| notification-group | \*.events   | Send notifications                 |
| analytics-group    | \*.events   | Analytics processing               |
