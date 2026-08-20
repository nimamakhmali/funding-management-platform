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

log_info "بررسی پیش‌نیازها..."
command -v docker >/dev/null 2>&1 || log_error "Docker نصب نیست!"
docker compose version >/dev/null 2>&1 || log_error "Docker Compose نصب نیست!"
log_success "Docker موجود است"

# ── Swap ────────────────────────────────────────────────
if [ "$EUID" -eq 0 ] && [ ! -f /swapfile ]; then
    log_info "ساخت 4GB Swap..."
    fallocate -l 4G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    log_success "Swap فعال شد"
fi

# ── بررسی .env ──────────────────────────────────────────
[ ! -f "./.env" ] && log_error "فایل .env در ریشه پیدا نشد!"
[ ! -f "./investment_platform_BackEnd/.env" ] && \
    log_error "فایل investment_platform_BackEnd/.env پیدا نشد!"

# ── توقف قبلی ───────────────────────────────────────────
log_info "توقف سرویس‌های قبلی..."
docker compose down --remove-orphans 2>/dev/null || true

# ── Build ────────────────────────────────────────────────
log_info "ساخت Image‌ها (ممکن است چند دقیقه طول بکشد)..."
docker compose build --no-cache
log_success "Build موفق"

# ── Start ────────────────────────────────────────────────
log_info "راه‌اندازی سرویس‌ها..."
docker compose up -d

# ── انتظار برای backend ──────────────────────────────────
log_info "انتظار برای آماده شدن بک‌اند (حداکثر 2 دقیقه)..."
TIMEOUT=120
ELAPSED=0
while ! docker compose exec -T backend \
    python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health/')" \
    2>/dev/null; do
    sleep 5
    ELAPSED=$((ELAPSED + 5))
    if [ $ELAPSED -ge $TIMEOUT ]; then
        log_error "بک‌اند در مدت مقرر آماده نشد! لاگ‌ها را بررسی کنید: docker compose logs backend"
    fi
    log_info "منتظر بک‌اند... ($ELAPSED/$TIMEOUT)"
done
log_success "بک‌اند آماده است"

# ── Superuser ────────────────────────────────────────────
read -p "آیا می‌خواهید superuser بسازید؟ (y/n) " CREATE_SUPER
if [ "$CREATE_SUPER" = "y" ]; then
    docker compose exec backend python manage.py createsuperuser
fi

SERVER_IP=$(grep "^SERVER_IP=" .env | cut -d '=' -f2)
echo ""
log_success "═══════════════════════════════════════"
log_success "   دیپلوی با موفقیت انجام شد!"
log_success "═══════════════════════════════════════"
echo -e "  ${GREEN}سامانه:${NC}  http://$SERVER_IP"
echo -e "  ${GREEN}API:${NC}     http://$SERVER_IP/api/"
echo -e "  ${GREEN}Swagger:${NC} http://$SERVER_IP/api/docs/"
echo -e "  ${GREEN}Admin:${NC}   http://$SERVER_IP/admin/"
echo ""
docker compose ps