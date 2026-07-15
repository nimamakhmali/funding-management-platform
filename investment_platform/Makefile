.PHONY: help build up down logs shell migrate test clean

help:
	@echo "Commands:"
	@echo "  make build       - Build Docker images"
	@echo "  make up          - Start all services"
	@echo "  make down        - Stop all services"
	@echo "  make logs        - View logs"
	@echo "  make shell       - Django shell"
	@echo "  make migrate     - Run migrations"
	@echo "  make test        - Run tests"
	@echo "  make superuser   - Create superuser"
	@echo "  make clean       - Clean volumes"

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f backend

shell:
	docker-compose exec backend python manage.py shell

migrate:
	docker-compose exec backend python manage.py migrate

test:
	docker-compose exec backend pytest

superuser:
	docker-compose exec backend python manage.py createsuperuser

clean:
	docker-compose down -v
	docker system prune -f