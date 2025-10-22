# MongoDB Schemas (JSON Schema Validation)

All collections use document validation to keep a consistent contract while allowing extensibility via `metadata`.

## event_logs
- Purpose: Immutable event stream
- TTL: 90 days (by `createdAt`)
- Indexes: `{ action:1, createdAt:-1 }`, `{ userId:1, createdAt:-1 }`
- Schema (validator):
```json
{
  "$jsonSchema": {
    "bsonType": "object",
    "required": ["action", "createdAt"],
    "properties": {
      "action": { "bsonType": "string", "description": "event name" },
      "userId": { "bsonType": ["string", "objectId", "null"] },
      "sessionId": { "bsonType": ["string", "null"] },
      "ip": { "bsonType": ["string", "null"] },
      "context": { "bsonType": ["object", "null"] },
      "createdAt": { "bsonType": "date" },
      "metadata": { "bsonType": ["object", "null"] }
    }
  }
}
```
- Example:
```json
{
  "action": "product.view",
  "userId": "64f1...",
  "sessionId": "sess_...",
  "ip": "203.0.113.4",
  "context": { "productId": 123, "categoryId": 7 },
  "createdAt": { "$date": "2025-10-19T10:23:11Z" }
}
```

## search_analytics
- Purpose: Search telemetry and outcomes
- Indexes: `{ q: 1, createdAt: -1 }`, text index on `q`
- Schema:
```json
{
  "$jsonSchema": {
    "bsonType": "object",
    "required": ["q", "createdAt"],
    "properties": {
      "q": { "bsonType": "string" },
      "filters": { "bsonType": ["object", "null"] },
      "resultCount": { "bsonType": ["int", "long", "null"] },
      "clickedProductIds": { "bsonType": ["array", "null"], "items": { "bsonType": ["int", "long"] } },
      "userId": { "bsonType": ["string", "objectId", "null"] },
      "createdAt": { "bsonType": "date" },
      "metadata": { "bsonType": ["object", "null"] }
    }
  }
}
```

## download_audit
- Purpose: Track product downloads and detect abuse
- Indexes: `{ productId:1, createdAt:-1 }`, `{ userId:1, createdAt:-1 }`
- Schema:
```json
{
  "$jsonSchema": {
    "bsonType": "object",
    "required": ["productId", "createdAt"],
    "properties": {
      "productId": { "bsonType": ["int", "long", "string"] },
      "userId": { "bsonType": ["string", "objectId", "null"] },
      "ip": { "bsonType": ["string", "null"] },
      "ua": { "bsonType": ["string", "null"] },
      "ref": { "bsonType": ["string", "null"] },
      "createdAt": { "bsonType": "date" },
      "metadata": { "bsonType": ["object", "null"] }
    }
  }
}
```

## ticket_messages (optional mirror)
- Purpose: Long conversations, avoids RDBMS bloat
- Indexes: `{ ticketId:1, createdAt:1 }`
- Schema:
```json
{
  "$jsonSchema": {
    "bsonType": "object",
    "required": ["ticketId", "createdAt", "body"],
    "properties": {
      "ticketId": { "bsonType": ["int", "long", "string"] },
      "userId": { "bsonType": ["string", "objectId", "null"] },
      "body": { "bsonType": "string" },
      "attachments": { "bsonType": ["array", "null"], "items": { "bsonType": "object" } },
      "createdAt": { "bsonType": "date" },
      "metadata": { "bsonType": ["object", "null"] }
    }
  }
}
```

