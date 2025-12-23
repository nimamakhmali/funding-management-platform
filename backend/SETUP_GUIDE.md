# راهنمای راه‌اندازی گام اول - اسکلت پروژه و زیرساخت پایه

این سند راهنمای کامل برای راه‌اندازی گام اول پروژه سامانه جذب سرمایه است.

## ✅ کارهای انجام شده

### 1. ساختار تنظیمات محیط‌های مختلف

ساختار تنظیمات به صورت زیر ایجاد شده است:

```
src/config/settings/
├── __init__.py      # انتخاب محیط بر اساس DJANGO_ENV
├── base.py          # تنظیمات مشترک همه محیط‌ها
├── dev.py           # تنظیمات محیط توسعه
├── staging.py       # تنظیمات محیط staging
└── production.py    # تنظیمات محیط production
```

**نحوه کار:**
- متغیر محیطی `DJANGO_ENV` تعیین می‌کند که کدام محیط لود شود
- به صورت پیش‌فرض `dev` استفاده می‌شود
- فایل `.env.{environment}` برای هر محیط لود می‌شود

### 2. تنظیمات Logging

سیستم logging کامل با قابلیت‌های زیر اضافه شده است:

- **Console Handler**: نمایش لاگ‌ها در کنسول
- **File Handler**: ذخیره لاگ‌ها در فایل `logs/django.log`
- **Error File Handler**: ذخیره خطاها در `logs/django_errors.log`
- **Rotating Files**: فایل‌های لاگ به صورت خودکار rotate می‌شوند (حداکثر 15MB، 10 فایل پشتیبان)
- **Loggers جداگانه**: برای Django، درخواست‌ها، و ماژول‌های پروژه

**سطوح لاگ در محیط‌های مختلف:**
- **Development**: DEBUG (بسیار جزئی)
- **Staging**: INFO (اطلاعات مهم)
- **Production**: WARNING (فقط هشدارها و خطاها)

### 3. تنظیمات Environment Variables

فایل‌های `.env.example` برای هر محیط ایجاد شده است:

- `.env.example` - نمونه کلی
- `.env.dev.example` - برای محیط توسعه
- `.env.staging.example` - برای محیط staging  
- `.env.production.example` - برای محیط production

**متغیرهای مهم:**
- `DJANGO_ENV`: محیط (dev/staging/production)
- `SECRET_KEY`: کلید مخفی Django
- `DEBUG`: حالت debug
- `ALLOWED_HOSTS`: میزبان‌های مجاز
- `DB_*`: تنظیمات دیتابیس PostgreSQL
- `CORS_ALLOWED_ORIGINS`: آدرس‌های مجاز برای CORS

### 4. CORS Headers

پکیج `django-cors-headers` اضافه شده و در middleware قرار گرفته است:

- **Development**: همه origin‌ها مجاز (برای تسهیل توسعه)
- **Staging/Production**: فقط origin‌های مشخص شده در `CORS_ALLOWED_ORIGINS`

### 5. تمیزسازی ساختار پروژه

- فایل قدیمی `settings.py` به `settings.py.old` منتقل شده
- پوشه `logs` ایجاد شده با فایل `.gitkeep`
- `.gitignore` به‌روزرسانی شده برای لاگ‌ها و فایل‌های محیطی

## 📋 مراحل بعدی برای راه‌اندازی

### مرحله 1: ایجاد فایل‌های .env

```bash
# برای محیط development
cp .env.dev.example .env.dev
# یا اگر از .env ساده استفاده می‌کنید:
cp .env.example .env
```

سپس فایل `.env` یا `.env.dev` را باز کرده و مقادیر را تنظیم کنید:

```env
DJANGO_ENV=dev
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=funding_management
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
```

### مرحله 2: ایجاد دیتابیس PostgreSQL

```sql
CREATE DATABASE funding_management;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE funding_management TO postgres;
```

### مرحله 3: نصب وابستگی‌ها

```bash
poetry install
```

### مرحله 4: اجرای Migrations

```bash
# فعال‌سازی محیط Poetry
poetry shell

# ساخت migrations
python src/manage.py makemigrations

# اعمال migrations
python src/manage.py migrate
```

### مرحله 5: ایجاد Superuser

```bash
python src/manage.py createsuperuser
```

### مرحله 6: اجرای سرور توسعه

```bash
# روش 1: استفاده از script تعریف شده
poetry run start

# روش 2: دستور مستقیم
python src/manage.py runserver
```

## 🔧 تست تنظیمات

برای بررسی اینکه همه چیز درست کار می‌کند:

```bash
# بررسی تنظیمات Django
python src/manage.py check

# تست import تنظیمات
python -c "import os; os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings'); import django; django.setup(); from django.conf import settings; print(f'Environment: {settings.DEBUG}')"
```

## 📁 ساختار نهایی پروژه

```
backend/
├── src/
│   ├── config/
│   │   ├── settings/
│   │   │   ├── __init__.py
│   │   │   ├── base.py
│   │   │   ├── dev.py
│   │   │   ├── staging.py
│   │   │   └── production.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── api/
│   ├── app/
│   ├── core/
│   ├── domain/
│   ├── infrastructure/
│   ├── shared/
│   ├── logs/          # پوشه لاگ‌ها
│   └── manage.py
├── .env               # فایل محیطی (ساخته نشده - باید ایجاد شود)
├── .env.example       # نمونه فایل محیطی
├── .env.dev.example   # نمونه برای development
├── .env.staging.example
├── .env.production.example
├── pyproject.toml
└── README.md
```

## 🔒 نکات امنیتی

1. **هرگز فایل `.env.production` را commit نکنید**
2. **SECRET_KEY را برای production تغییر دهید** و از یک کلید قوی استفاده کنید
3. **در production حتماً `DEBUG=False` باشد**
4. **ALLOWED_HOSTS را در production به درستی تنظیم کنید**
5. **از HTTPS در production استفاده کنید** (تنظیمات امنیتی در `production.py` فعال هستند)

## 🚀 تغییر محیط

برای تغییر محیط، متغیر `DJANGO_ENV` را تنظیم کنید:

```bash
# Development (پیش‌فرض)
export DJANGO_ENV=dev

# Staging
export DJANGO_ENV=staging

# Production
export DJANGO_ENV=production
```

یا در فایل `.env`:
```env
DJANGO_ENV=dev
```

## 📝 لاگ‌ها

لاگ‌ها در پوشه `src/logs/` ذخیره می‌شوند:

- `django.log`: تمام لاگ‌های برنامه
- `django_errors.log`: فقط خطاها

این فایل‌ها به صورت خودکار rotate می‌شوند (حداکثر 15MB، 10 نسخه پشتیبان).

## ✅ چک‌لیست نهایی

- [x] ساختار settings برای محیط‌های مختلف
- [x] تنظیمات logging
- [x] فایل‌های .env.example
- [x] CORS headers
- [x] تمیزسازی ساختار پروژه
- [ ] ایجاد فایل .env و تنظیم مقادیر
- [ ] ایجاد دیتابیس PostgreSQL
- [ ] نصب وابستگی‌ها
- [ ] اجرای migrations
- [ ] تست اجرای سرور

## 🆘 رفع مشکلات

### مشکل: `ModuleNotFoundError: No module named 'config.settings'`
**راه حل**: مطمئن شوید که از دایرکتوری `src` اجرا می‌کنید یا path درست است.

### مشکل: `django.core.exceptions.ImproperlyConfigured: SECRET_KEY`
**راه حل**: فایل `.env` را ایجاد کرده و `SECRET_KEY` را تنظیم کنید.

### مشکل: `django.db.utils.OperationalError: could not connect to server`
**راه حل**: 
1. مطمئن شوید PostgreSQL در حال اجرا است
2. تنظیمات دیتابیس در `.env` را بررسی کنید
3. دیتابیس را ایجاد کنید

### مشکل: CORS errors در frontend
**راه حل**: 
- در development: `CORS_ALLOW_ALL_ORIGINS = True` (در `dev.py` فعال است)
- در staging/production: `CORS_ALLOWED_ORIGINS` را در `.env` تنظیم کنید

## 📚 منابع

- [Django Settings Documentation](https://docs.djangoproject.com/en/4.2/topics/settings/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [django-cors-headers](https://github.com/adamchainz/django-cors-headers)
- [python-dotenv](https://github.com/theskumar/python-dotenv)

