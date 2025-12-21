# Funding Management Platform - Backend

پروژه بک‌اند پلتفرم مدیریت تامین مالی با استفاده از Django REST Framework و PostgreSQL

## ساختار پروژه

```
backend/
├── src/
│   ├── config/          # تنظیمات اصلی Django
│   ├── api/            # API endpoints و ViewSets
│   ├── app/            # Django apps
│   ├── core/           # کدهای اصلی و مشترک
│   ├── domain/         # Domain models و business logic
│   ├── infrastructure/ # Infrastructure layer (repositories, external services)
│   ├── shared/         # کدهای مشترک و utilities
│   └── manage.py       # Django management script
├── .venv/              # Virtual environment (Poetry)
├── .env                 # تنظیمات محیطی (local)
├── .env.example         # نمونه تنظیمات محیطی
├── pyproject.toml       # تنظیمات Poetry
└── poetry.lock          # Lock file برای وابستگی‌ها
```

## پیش‌نیازها

- Python 3.12+
- Poetry
- PostgreSQL 12+

## نصب و راه‌اندازی

### 1. نصب وابستگی‌ها

```bash
cd backend
poetry install
```

### 2. تنظیم دیتابیس PostgreSQL

ابتدا دیتابیس PostgreSQL را ایجاد کنید:

```sql
CREATE DATABASE funding_management;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE funding_management TO postgres;
```

### 3. تنظیم فایل .env

فایل `.env.example` را کپی کرده و تنظیمات خود را وارد کنید:

```bash
cp .env.example .env
```

### 4. اجرای Migrations

```bash
poetry run python src/manage.py makemigrations
poetry run python src/manage.py migrate
```

### 5. ایجاد Superuser

```bash
poetry run python src/manage.py createsuperuser
```

### 6. اجرای سرور توسعه

```bash
poetry run python src/manage.py runserver
```

یا از script تعریف شده در Poetry استفاده کنید:

```bash
poetry run start
```

## ساختار معماری

این پروژه از معماری Clean Architecture / Domain-Driven Design استفاده می‌کند:

- **domain/**: مدل‌های دامنه و منطق کسب‌وکار
- **infrastructure/**: لایه زیرساخت (repositories، سرویس‌های خارجی)
- **app/**: Django apps
- **api/**: API endpoints و serializers
- **core/**: کدهای اصلی و مشترک
- **shared/**: utilities و helper functions

## دستورات مفید

```bash
# اجرای سرور
poetry run python src/manage.py runserver

# ساخت migrations
poetry run python src/manage.py makemigrations

# اعمال migrations
poetry run python src/manage.py migrate

# اجرای tests
poetry run python src/manage.py test

# دسترسی به shell Django
poetry run python src/manage.py shell

# بررسی تنظیمات
poetry run python src/manage.py check
```

## API Endpoints

API endpoints در مسیر `/api/` در دسترس هستند.

## تنظیمات

تمام تنظیمات در فایل `src/config/settings.py` و فایل `.env` قرار دارند.



