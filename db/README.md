# Sci Market Database Schema

این پروژه شامل اسکیمای کامل پایگاه داده PostgreSQL و افزونه NoSQL (MongoDB) برای سامانه آنلاین شاپ علمی است.

## فایل‌های موجود

### 1. `01_create_enums.sql`
تعریف انواع ENUM مورد استفاده در پایگاه داده:
- `user_role`: نقش‌های کاربری (admin, support, seller, buyer)
- `language_preference`: ترجیح زبان (fa, en)
- `theme_preference`: ترجیح تم (light, dark)
- `file_type`: نوع فایل (pdf, zip, code, dataset, other)
- `order_status`: وضعیت سفارش
- `payment_method`: روش پرداخت
- `transaction_type`: نوع تراکنش
- `transaction_status`: وضعیت تراکنش
- `ticket_status`: وضعیت تیکت

### 2. `02_create_tables.sql`
ایجاد جداول اصلی پایگاه داده:
- **users**: اطلاعات کاربران
- **user_roles**: نقش‌های کاربری (RBAC)
- **categories**: دسته‌بندی‌های محصولات
- **products**: محصولات علمی
- **product_files**: فایل‌های اضافی محصولات
- **wallets**: کیف پول‌های کاربران
- **transactions**: تراکنش‌های مالی
- **carts**: سبد خرید
- **cart_items**: اقلام سبد خرید
- **orders**: سفارشات
- **order_items**: اقلام سفارش
- **tickets**: تیکت‌های پشتیبانی
- **ticket_responses**: پاسخ‌های تیکت
- **reviews**: نظرات و امتیازدهی
- **wishlists**: لیست علاقه‌مندی‌ها
- **audit_logs**: لاگ‌های امنیتی

### 3. `03_create_indexes.sql`
ایجاد ایندکس‌های بهینه‌سازی عملکرد:
- ایندکس‌های اصلی برای جستجو
- ایندکس‌های ترکیبی برای کوئری‌های پیچیده
- ایندکس‌های GIN برای جستجوی متن
- ایندکس‌های جزئی برای فیلترهای خاص

### 4. `04_create_triggers.sql`
تریگرهای خودکار:
- به‌روزرسانی timestamps
- تولید شماره سفارش
- ایجاد کیف پول برای کاربران جدید
- به‌روزرسانی آمار محصولات
- اعتبارسنجی تراکنش‌های کیف پول
- ثبت لاگ‌های audit

### 5. `05_create_functions.sql`
توابع ذخیره‌شده:
- **کیف پول**: `add_wallet_funds`, `deduct_wallet_funds`, `transfer_wallet_funds`
- **محصولات**: `increment_product_views`, `get_product_rating`, `get_product_review_count`
- **سفارشات**: `create_order_from_cart`, `process_order_payment`
- **جستجو**: `search_products`
- **آمار**: `get_user_stats`, `get_system_stats`

### 6. `06_create_views.sql`
نمای‌های پایگاه داده:
- **product_details**: جزئیات محصولات با آمار
- **featured_products**: محصولات ویژه
- **category_stats**: آمار دسته‌بندی‌ها
- **user_profiles**: پروفایل‌های کاربران
- **active_sellers**: فروشندگان فعال
- **order_details**: جزئیات سفارشات
- **transaction_history**: تاریخچه تراکنش‌ها
- **product_reviews**: نظرات محصولات
- **ticket_details**: جزئیات تیکت‌ها
- **daily_sales_stats**: آمار فروش روزانه
- **product_performance**: عملکرد محصولات

### 7. `07_seed_data.sql`
داده‌های نمونه:
- دسته‌بندی‌های علمی
- کاربران نمونه (admin, support, sellers, buyers)
- محصولات نمونه
- نظرات و امتیازات
- سفارشات نمونه
- تیکت‌های پشتیبانی

## نصب و راه‌اندازی

### پیش‌نیازها
- PostgreSQL 12 یا بالاتر
- دسترسی ادمین به پایگاه داده
- MongoDB 6 یا بالاتر (برای لاگ‌های رخداد، تحلیل جستجو، و ذخیره‌سازی اسناد بزرگ)

### مراحل نصب

1. **ایجاد پایگاه داده**:
```sql
CREATE DATABASE sci_market;
\c sci_market;
```

2. **اجرای فایل‌ها به ترتیب**:
```bash
psql -d sci_market -f 01_create_enums.sql
psql -d sci_market -f 02_create_tables.sql
psql -d sci_market -f 03_create_indexes.sql
psql -d sci_market -f 04_create_triggers.sql
psql -d sci_market -f 05_create_functions.sql
psql -d sci_market -f 06_create_views.sql
psql -d sci_market -f 07_seed_data.sql
```

3. **بررسی نصب**:
```sql
-- بررسی جداول
\dt

-- بررسی توابع
\df

-- بررسی نمای‌ها
\dv

-- بررسی ایندکس‌ها
\di
```

## ویژگی‌های کلیدی

### امنیت
- رمزنگاری پسوردها با bcrypt
- سیستم RBAC (Role-Based Access Control)
- لاگ‌های audit کامل
- اعتبارسنجی ورودی‌ها

### عملکرد
- ایندکس‌های بهینه‌سازی شده
- نمای‌های از پیش محاسبه شده
- توابع ذخیره‌شده برای عملیات پیچیده
- پارتیشن‌بندی برای جداول بزرگ

### مقیاس‌پذیری
- طراحی نرمال‌سازی شده
- پشتیبانی از تراکنش‌های همزمان
- بهینه‌سازی برای 500 تراکنش روزانه
- قابلیت گسترش افقی

### چندزبانه
- پشتیبانی از فارسی و انگلیسی
- جستجوی متن کامل
- ایندکس‌های GIN برای جستجوی پیشرفته

## استفاده با Django

برای استفاده با Django، تنظیمات زیر را در `settings.py` اضافه کنید:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'sci_market',
        'USER': 'your_username',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

## پشتیبان‌گیری

```bash
# پشتیبان‌گیری کامل
pg_dump -h localhost -U username -d sci_market > backup.sql

# پشتیبان‌گیری فقط داده‌ها
pg_dump -h localhost -U username -d sci_market --data-only > data_backup.sql

# پشتیبان‌گیری فقط اسکیمای
pg_dump -h localhost -U username -d sci_market --schema-only > schema_backup.sql
```

## بازیابی

```bash
# بازیابی کامل
psql -h localhost -U username -d sci_market < backup.sql

# بازیابی فقط داده‌ها
psql -h localhost -U username -d sci_market < data_backup.sql
```

## نظارت و بهینه‌سازی

### کوئری‌های مفید برای نظارت

```sql
-- بررسی عملکرد کوئری‌ها
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- بررسی ایندکس‌های استفاده نشده
SELECT schemaname, tablename, indexname, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
WHERE idx_tup_read = 0;

-- بررسی اندازه جداول
SELECT schemaname, tablename, 
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## عیب‌یابی

### مشکلات رایج

1. **خطای اتصال**: بررسی تنظیمات PostgreSQL و فایروال
2. **خطای مجوز**: بررسی دسترسی‌های کاربر
3. **خطای حافظه**: تنظیم `shared_buffers` و `work_mem`
4. **خطای لاک**: بررسی تراکنش‌های طولانی

### لاگ‌ها

```sql
-- فعال‌سازی لاگ‌های کند
ALTER SYSTEM SET log_min_duration_statement = 1000;
SELECT pg_reload_conf();

-- بررسی لاگ‌ها
SELECT * FROM pg_stat_activity WHERE state = 'active';
```

## توسعه و نگهداری

### به‌روزرسانی اسکیمای
- استفاده از migration های Django
- تست تغییرات در محیط توسعه
- پشتیبان‌گیری قبل از تغییرات

### بهینه‌سازی عملکرد
- مانیتورینگ منظم کوئری‌ها
- به‌روزرسانی آمار جداول
- پاک‌سازی ایندکس‌های استفاده نشده

### امنیت
- به‌روزرسانی منظم PostgreSQL
- بررسی دسترسی‌های کاربران
- مانیتورینگ لاگ‌های audit

## پشتیبانی

برای سوالات و مشکلات:
- ایمیل: support@sci-market.ir
- تیکت: از طریق پنل کاربری
- مستندات: [لینک مستندات]

---

**تیم توسعه BlueUp**  
**تاریخ آخرین به‌روزرسانی**: 2025-09-28

## MongoDB (NoSQL) افزوده‌ها

MongoDB برای نگهداری داده‌های حجیمِ غیرساخت‌یافته/نیمه‌ساخت‌یافته و لاگ‌های با نرخ بالا استفاده می‌شود. این بخش مکمل PostgreSQL است و تراکنش‌های مالی و مرجعیت داده‌ها همچنان در PostgreSQL باقی می‌مانند.

### کالکشن‌ها
- `event_logs`:
  - purpose: لاگ رخدادهای سطح اپلیکیشن (مشاهده محصول، جستجو، ورود، کلیک)
  - schema:
    - userId (ObjectId | Number), action (string), ip (string), userAgent (string), metadata (object), createdAt (ISODate)
  - indexes:
    - { action: 1, createdAt: -1 }
    - { userId: 1, createdAt: -1 }
    - TTL: { createdAt: 1 } expireAfterSeconds: 60*60*24*90  (حفظ 90 روز)

- `search_analytics`:
  - purpose: تحلیل کلیدواژه‌های جستجو و نرخ کلیک
  - schema: { q: string, filters: object, results: number, clickedProductId: number, userId: number|null, createdAt: ISODate }
  - indexes: { q: 1, createdAt: -1 }, { results: -1 }

- `download_audit`:
  - purpose: ثبت دانلود فایل‌های دیجیتال با ردیابی ضدتقلب
  - schema: { orderId: number, productId: number, userId: number, fileId: number|null, ip: string, ok: boolean, reason: string|null, createdAt: ISODate }
  - indexes: { userId: 1, createdAt: -1 }, { productId: 1, createdAt: -1 }

- `ticket_messages` (optional mirror):
  - purpose: مقیاس‌پذیری گفتگوهای طولانی تیکت (در کنار PostgreSQL)
  - schema: { ticketId: number, userId: number, body: string, attachments: [object], createdAt: ISODate }
  - indexes: { ticketId: 1, createdAt: 1 }

### راه‌اندازی MongoDB

نمونه اسکریپت init در فایل `mongodb/init.js` (ساخته می‌شود):

```javascript
db = db.getSiblingDB('sci_market');

db.createCollection('event_logs');
db.event_logs.createIndex({ action: 1, createdAt: -1 });
db.event_logs.createIndex({ userId: 1, createdAt: -1 });
db.event_logs.createIndex({ createdAt: 1 }, { expireAfterSeconds: 60*60*24*90 });

db.createCollection('search_analytics');
db.search_analytics.createIndex({ q: 1, createdAt: -1 });
db.search_analytics.createIndex({ results: -1 });

db.createCollection('download_audit');
db.download_audit.createIndex({ userId: 1, createdAt: -1 });
db.download_audit.createIndex({ productId: 1, createdAt: -1 });

db.createCollection('ticket_messages');
db.ticket_messages.createIndex({ ticketId: 1, createdAt: 1 });
```

اجرای اسکریپت:

```bash
mongo mongodb://localhost:27017/admin mongodb/init.js
```

### هم‌زیستی PostgreSQL و MongoDB
- تراکنش‌ها، سفارش‌ها، موجودی کیف پول و هر داده دارای سازگاری قوی: PostgreSQL
- لاگ‌های حجیم، تحلیل رفتار کاربر، داده‌های telemetry و raw events: MongoDB
- کلیدهای ارجاعی بین سیستم‌ها با نگهداری `userId`, `productId`, `orderId` در اسناد MongoDB (بدون FK)

















