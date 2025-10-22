# Sample Queries and Aggregations (MongoDB)

## Top viewed products (last 7 days)
```javascript
 db.event_logs.aggregate([
   { $match: { action: 'product.view', createdAt: { $gte: new Date(Date.now()-7*864e5) } } },
   { $group: { _id: '$context.productId', views: { $sum: 1 } } },
   { $sort: { views: -1 } },
   { $limit: 20 }
 ])
```

## Conversion from view to download (last 30 days)
```javascript
 const since = new Date(Date.now()-30*864e5);
 const views = db.event_logs.aggregate([
   { $match: { action: 'product.view', createdAt: { $gte: since } } },
   { $group: { _id: '$context.productId', views: { $sum: 1 } } }
 ]);
 const downloads = db.download_audit.aggregate([
   { $match: { createdAt: { $gte: since } } },
   { $group: { _id: '$productId', downloads: { $sum: 1 } } }
 ]);
```

## Search query performance
```javascript
 db.search_analytics.aggregate([
   { $match: { createdAt: { $gte: new Date(Date.now()-7*864e5) } } },
   { $project: { q: 1, resultCount: 1, hits: { $size: { $ifNull: ['$clickedProductIds', []] } } } },
   { $group: { _id: '$q', avgResults: { $avg: '$resultCount' }, avgHits: { $avg: '$hits' }, cnt: { $sum: 1 } } },
   { $sort: { cnt: -1 } },
   { $limit: 50 }
 ])
```

## Ticket conversation export
```javascript
 db.ticket_messages.find({ ticketId: 123 }).sort({ createdAt: 1 })
```

## Abuse detection (downloads per user per day)
```javascript
 db.download_audit.aggregate([
   { $group: { _id: { userId: '$userId', d: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } } }, cnt: { $sum: 1 } } },
   { $match: { cnt: { $gt: 100 } } },
   { $sort: { cnt: -1 } }
 ])
```

