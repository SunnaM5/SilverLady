# ---------- 1) Build frontend ----------
FROM node:20-alpine AS frontend_build
WORKDIR /app/frontend

COPY frontend/package*.json ./
# если package-lock.json есть (у вас он есть) — оставляем npm ci
RUN npm ci

COPY frontend/ ./
RUN npm run build


# ---------- 2) Run backend ----------
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# зависимости для python/psycopg (если postgres)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libpq-dev \
  && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

COPY backend/ /app/backend/

# кладём собранный фронт в место, откуда Django его раздаёт
COPY --from=frontend_build /app/frontend/dist /app/backend/frontend_dist

WORKDIR /app/backend
RUN python manage.py collectstatic --noinput || true

CMD sh -c "python manage.py migrate && gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000}"
