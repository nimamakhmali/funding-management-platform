#!/bin/bash
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info()    { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[OK]${NC} $1"; }
log_warn()    { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error()   { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# ── بررسی Docker ──
log_info "بررسی پیش‌نیازها..."
command -v docker >/dev/null 2>&1 || log_error "Docker نصب نیست!"
docker compose version >/dev/null 2>&1 || log_error "Docker Compose نصب نیست!"
log_success "Docker موجود است"

# ── ساخت Swap برای جلوگیری از OOM (فقط با sudo) ──
if [ "$EUID" -eq 0 ] && [ ! -f /swapfile ]; then
    log_info "ساخت 4GB فایل Swap (سرور شما فقط 2GB رم دارد)..."
    fallocate -l 4G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    log_success "Swap فعال شد"
else
    log_warn "Swap از قبل هست یا دسترسی root نیست (برای ساخت Swap با sudo اجرا کنید)"
fi

# ── بررسی فایل‌های .env ──
if [ ! -f "./.env" ]; then
    log_error "فایل .env در ریشه پیدا نشد! ابتدا: cp .env.example .env  و مقادیر را ویرایش کنید."
fi
if [ ! -f "./investment_platform_BackEnd/.env" ]; then
    log_error "فایل investment_platform_BackEnd/.env پیدا نشد!"
fi

# ── توقف کانتینرهای قبلی ──
log_info "توقف سرویس‌های قبلی (در صورت وجود)..."
docker compose down --remove-orphans 2>/dev/null || true

# ── Build ──
log_info "ساخت Image‌ها (چند دقیقه طول می‌کشد، صبور باشید)..."
docker compose build
log_success "Build موفق"

# ── راه‌اندازی همه سرویس‌ها (ترتیب توسط depends_on مدیریت می‌شود) ──
log_info "راه‌اندازی سرویس‌ها..."
docker compose up -d

log_info "انتظار برای سالم شدن بک‌اند..."
sleep 25

# ── ایجاد Superuser (اختیاری) ──
read -p "آیا می‌خواهید یک حساب مدیر (superuser) بسازید؟ (y/n) " CREATE_SUPER
if [ "$CREATE_SUPER" = "y" ]; then
    docker compose exec backend python manage.py createsuperuser
fi

SERVER_IP=$(grep SERVER_IP .env | cut -d '=' -f2)
echo ""
log_success "═══════════════════════════════════════"
log_success "   دیپلوی با موفقیت انجام شد!"
log_success "═══════════════════════════════════════"
echo -e "  ${GREEN}سامانه:${NC}   http://$SERVER_IP"
echo -e "  ${GREEN}API:${NC}      http://$SERVER_IP/api/"
echo -e "  ${GREEN}Admin:${NC}    http://$SERVER_IP/admin/"
echo ""
docker compose ps