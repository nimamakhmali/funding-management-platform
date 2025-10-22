# Indexes, Retention, and Capacity Planning

## Index Strategy
- event_logs: `{ action:1, createdAt:-1 }`, `{ userId:1, createdAt:-1 }`, TTL on `createdAt`
- search_analytics: `{ q:1, createdAt:-1 }`, `{ resultCount:-1 }`, `text(q)` for full-text
- download_audit: `{ productId:1, createdAt:-1 }`, `{ userId:1, createdAt:-1 }`
- ticket_messages: `{ ticketId:1, createdAt:1 }`

Use `partialFilterExpression` where appropriate to reduce index size on sparse fields.

## TTL Policies
- event_logs: 90 days (drop expired documents automatically)
- search_analytics: optional 180 days (set if volume is high)
- download_audit: 180-365 days depending on analytics needs

## Estimation & Capacity
- Estimate write rate per collection; ensure working set fits in memory for hot indexes.
- Prefer rolling windows (TTL) to keep collections bounded.
- Consider weekly archiving to cold storage (S3) via scheduled export.

## Sharding (when needed)
- Shard keys (guideline):
  - event_logs: `{ createdAt: 1, action: 1 }` with hashed alternatives
  - search_analytics: `{ createdAt: 1 }` or hashed `{ userId: 'hashed' }`
  - download_audit: `{ productId: 1, createdAt: 1 }`
- Pre-split and use zone sharding by time ranges if write-hot.

## Performance Tips
- Keep documents small (< 16MB limit; target < 50KB typical).
- Avoid unbounded arrays; prefer one document per event.
- Avoid too many indexes; measure with `system.profile` or `perf` tools.

