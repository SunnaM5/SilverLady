#!/bin/sh
set -e
cd /app
python manage.py migrate --noinput
python manage.py collectstatic --noinput --clear 2>/dev/null || true
exec "$@"
