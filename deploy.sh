#!/bin/bash
set -e

# ─── رنگ‌ها برای خروجی ──────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info()    { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[OK]${NC} $1"; }
log_warn()    { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error()   { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# ─── بررسی پیش‌نیازها ───────────────────────────────────
log_info "بررسی پیش‌نیازها..."
command -v docker        || log_error "Docker نصب نیست!"
command -v docker-compose || command -v docker compose || log_error "Docker Compose نصب نیست!"
log_success "پیش‌نیازها تأیید شد"

# ─── بررسی فایل .env ─────────────────────────────────────
if [ ! -f "./investment_platform_BackEnd/.env" ]; then
    log_warn "فایل .env بک‌اند پیدا نشد، از example کپی می‌شود"
    cp ./investment_platform_BackEnd/.env.example \
       ./investment_platform_BackEnd/.env
    log_warn "لطفاً فایل investment_platform_BackEnd/.env را ویرایش کنید!"
fi

# ─── توقف کانتینرهای قبلی ───────────────────────────────
log_info "توقف سرویس‌های قبلی..."
docker compose down --remove-orphans 2>/dev/null || true

# ─── Build ───────────────────────────────────────────────
log_info "ساخت imageها..."
docker compose build \
  --build-arg NEXT_PUBLIC_API_BASE_URL="http://5.198.179.184" \
  --build-arg NEXT_PUBLIC_API_URL="http://5.198.179.184" \
  --no-cache

log_success "Build موفق"

# ─── راه‌اندازی دیتابیس ──────────────────────────────────
log_info "راه‌اندازی دیتابیس..."
docker compose up -d db
log_info "انتظار برای آماده شدن دیتابیس..."
sleep 15

# ─── راه‌اندازی بک‌اند ───────────────────────────────────
log_info "راه‌اندازی بک‌اند..."
docker compose up -d backend
log_info "انتظار برای آماده شدن بک‌اند (60 ثانیه)..."
sleep 60

# ─── راه‌اندازی همه سرویس‌ها ─────────────────────────────
log_info "راه‌اندازی همه سرویس‌ها..."
docker compose up -d

# ─── ایجاد superuser (اختیاری) ───────────────────────────
log_info "آیا می‌خواهید superuser بسازید؟ (y/n)"
read -r CREATE_SUPER
if [ "$CREATE_SUPER" = "y" ]; then
    docker compose exec backend python manage.py createsuperuser
fi

# ─── نمایش وضعیت ─────────────────────────────────────────
echo ""
log_success "═══════════════════════════════════════"
log_success "   دیپلوی با موفقیت انجام شد!"
log_success "═══════════════════════════════════════"
echo ""
echo -e "  ${GREEN}سامانه:${NC}     http://5.198.179.184"
echo -e "  ${GREEN}API:${NC}         http://5.198.179.184/api/v1/"
echo -e "  ${GREEN}Admin:${NC}       http://5.198.179.184/admin/"
echo ""

docker compose ps