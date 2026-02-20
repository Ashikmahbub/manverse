cd /var/www/manverse

# Rebuild with volume mounts
docker compose down
docker compose up -d

# Wait for containers
sleep 15

# Migrate and collectstatic
docker exec manverse_backend python manage.py migrate --no-input
docker exec manverse_backend python manage.py collectstatic --no-input

# Fix permissions
chown -R www-data:www-data /home/manverse/static/
chmod 755 /home/manverse

# Test
curl http://103.6.168.232/static/admin/css/base.css | head -3
