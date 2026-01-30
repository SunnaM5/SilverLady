# ---------- 1) Build frontend ----------
FROM node:20-alpine AS frontend_build
WORKDIR /app/frontend

# ставим зависимости
COPY frontend/package*.json ./
# если package-lock.json нет — npm ci упадёт. Тогда меняйте на npm install
RUN npm ci

# собираем фронт
COPY frontend/ ./
RUN npm run build


# ---------- 2) Backend runtime ----------
FROM python:3.12-slim AS backend

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app/backend

# системные зависимости (если PostgreSQL)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
  && rm -rf /var/lib/apt/lists/*

# python зависимости
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# код бэкенда
COPY backend/ ./

# кладём собранный фронт туда, где Django ждёт dist
# (у вас в settings есть FRONTEND_DIST = backend/frontend_dist)
COPY --from=frontend_build /app/frontend/dist ./frontend_dist

# статика django (admin, DRF и т.д.)
RUN python manage.py collectstatic --noinput

# миграции можно запускать при старте (простое решение)
CMD sh -c "python manage.py migrate && gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000}"
