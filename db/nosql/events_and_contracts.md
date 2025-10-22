# Events and Data Contracts (NoSQL)

This document standardizes event names and required fields used in MongoDB.

## Naming Convention
- Domain prefixed: `<domain>.<action>` e.g., `product.view`, `order.paid`

## Core Events
- product.view
  - Required: productId (int), createdAt (date)
  - Optional: categoryId (int), userId (string|ObjectId), sessionId (string)
  - Stored in: event_logs.context + top-level user/session
- product.download
  - Required: productId, createdAt
  - Optional: userId, ip, ua, ref
  - Stored in: download_audit
- search.query
  - Required: q (string), createdAt
  - Optional: filters (object), resultCount (int), clickedProductIds (int[]), userId
  - Stored in: search_analytics
- ticket.message
  - Required: ticketId, body, createdAt
  - Optional: userId, attachments[]
  - Stored in: ticket_messages
- order.paid
  - Required: orderId, createdAt
  - Optional: userId, amount
  - Stored in: event_logs

## PII & Compliance
- IP and user identifiers are PII; mask or hash if exported.
- Respect deletion requests: remove userId and related context on GDPR delete (soft-delete by redaction in NoSQL).

## Versioning
- Add `metadata.version` when evolving contracts; support reader tolerance.

