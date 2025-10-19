// MongoDB initialization script for Sci Market
// Run with: mongo mongodb://localhost:27017/admin db/mongodb_init.js

db = db.getSiblingDB('sci_market');

// Event Logs
db.createCollection('event_logs');
db.event_logs.createIndex({ action: 1, createdAt: -1 });
db.event_logs.createIndex({ userId: 1, createdAt: -1 });
db.event_logs.createIndex({ createdAt: 1 }, { expireAfterSeconds: 60*60*24*90 }); // 90 days TTL

// Search Analytics
db.createCollection('search_analytics');
db.search_analytics.createIndex({ q: 1, createdAt: -1 });
db.search_analytics.createIndex({ results: -1 });

// Download Audit
db.createCollection('download_audit');
db.download_audit.createIndex({ userId: 1, createdAt: -1 });
db.download_audit.createIndex({ productId: 1, createdAt: -1 });

// Ticket Messages (optional mirror)
db.createCollection('ticket_messages');
db.ticket_messages.createIndex({ ticketId: 1, createdAt: 1 });




