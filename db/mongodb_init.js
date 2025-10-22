// MongoDB initialization script for Sci Market
// Run with: mongo mongodb://localhost:27017/admin db/mongodb_init.js

try {
  db = db.getSiblingDB('sci_market');

  // Event Logs
  db.createCollection('event_logs', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['action', 'createdAt'],
        properties: {
          action: { bsonType: 'string' },
          userId: { bsonType: ['string', 'objectId', 'null'] },
          sessionId: { bsonType: ['string', 'null'] },
          ip: { bsonType: ['string', 'null'] },
          context: { bsonType: ['object', 'null'] },
          createdAt: { bsonType: 'date' },
          metadata: { bsonType: ['object', 'null'] }
        }
      }
    }
  });
  db.event_logs.createIndex({ action: 1, createdAt: -1 });
  db.event_logs.createIndex({ userId: 1, createdAt: -1 });
  db.event_logs.createIndex({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 }); // 90 days TTL

  // Search Analytics
  db.createCollection('search_analytics', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['q', 'createdAt'],
        properties: {
          q: { bsonType: 'string' },
          filters: { bsonType: ['object', 'null'] },
          resultCount: { bsonType: ['int', 'long', 'null'] },
          clickedProductIds: {
            bsonType: ['array', 'null'],
            items: { bsonType: ['int', 'long'] }
          },
          userId: { bsonType: ['string', 'objectId', 'null'] },
          createdAt: { bsonType: 'date' },
          metadata: { bsonType: ['object', 'null'] }
        }
      }
    }
  });
  db.search_analytics.createIndex({ q: 1, createdAt: -1 });
  db.search_analytics.createIndex({ q: 'text' });
  db.search_analytics.createIndex({ resultCount: -1 });

  // Download Audit
  db.createCollection('download_audit', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['productId', 'createdAt'],
        properties: {
          productId: { bsonType: ['int', 'long', 'string'] },
          userId: { bsonType: ['string', 'objectId', 'null'] },
          ip: { bsonType: ['string', 'null'] },
          ua: { bsonType: ['string', 'null'] },
          ref: { bsonType: ['string', 'null'] },
          createdAt: { bsonType: 'date' },
          metadata: { bsonType: ['object', 'null'] }
        }
      }
    }
  });
  db.download_audit.createIndex({ userId: 1, createdAt: -1 });
  db.download_audit.createIndex({ productId: 1, createdAt: -1 });

  // Ticket Messages (optional mirror)
  db.createCollection('ticket_messages', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['ticketId', 'createdAt', 'body'],
        properties: {
          ticketId: { bsonType: ['int', 'long', 'string'] },
          userId: { bsonType: ['string', 'objectId', 'null'] },
          body: { bsonType: 'string' },
          attachments: { bsonType: ['array', 'null'], items: { bsonType: 'object' } },
          createdAt: { bsonType: 'date' },
          metadata: { bsonType: ['object', 'null'] }
        }
      }
    }
  });
  db.ticket_messages.createIndex({ ticketId: 1, createdAt: 1 });

} catch (e) {
  print('MongoDB init error:', e);
}




