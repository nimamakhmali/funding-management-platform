#!/bin/bash
set -e

echo "🚀 Starting deployment..."

# 1. Pull latest code
git pull origin main

# 2. Build new image
docker-compose build --no-cache

# 3. Stop old containers
docker-compose down

# 4. Start new containers
docker-compose up -d

# 5. Run migrations
docker-compose exec -T backend python manage.py migrate --noinput

# 6. Collect static files
docker-compose exec -T backend python manage.py collectstatic --noinput --clear

# 7. Health check
sleep 10
if curl -f http://localhost:8000/api/v1/ > /dev/null 2>&1; then
    echo "✅ Deployment successful!"
else
    echo "❌ Health check failed!"
    docker-compose logs backend
    exit 1
fi

# 8. Cleanup old images
docker image prune -f

echo "🎉 Deployment completed!"