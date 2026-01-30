# Stage 1: Build frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci --omit=dev 2>/dev/null || npm install

COPY frontend/ ./
ENV NODE_ENV=production
RUN npm run build

# Stage 2: Backend + collect static + serve SPA
FROM python:3.12-slim AS backend
WORKDIR /app

ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=config.settings

# Install system deps for psycopg2 and Pillow
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev gcc libjpeg-dev zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./

# Copy frontend build into backend static (SPA)
RUN mkdir -p frontend_dist
COPY --from=frontend-build /app/frontend/dist/ ./frontend_dist/

RUN python manage.py collectstatic --noinput --clear 2>/dev/null || true

COPY backend/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8000
ENTRYPOINT ["/entrypoint.sh"]
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "2", "--threads", "4"]
