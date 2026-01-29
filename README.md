# Manverse – Full Stack E-Commerce Platform

Manverse is a modern full-stack e-commerce platform built with Django REST Framework and Next.js (App Router). The project is designed for scalability and production deployment using Docker, CI/CD, and cloud infrastructure.

## Tech Stack

### Backend
- Django
- Django REST Framework
- SQLite (local development)
- PostgreSQL (production – planned)
- Redis (caching / background jobs – planned)
- Gunicorn (production WSGI server)

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Next/Image

 ## Project Structure

manverse/
├── backend/
│ ├── config/
│ ├── products/
│ ├── orders/
│ ├── payments/
│ ├── users/
│ ├── media/
│ ├── manage.py
│ ├── requirements.txt
│ ├── db.sqlite3
│ └── .env
│
├── frontend/
│ └── frontend/
│ ├── app/
│ ├── components/
│ ├── public/
│ ├── package.json
│ └── next.config.ts
│
└── README.md

---

## Backend Setup (Django)

### 1. Create Virtual Environment
```bash
cd backend
python -m venv venv
venv\Scripts\activate (windows)
source venv/bin/activate  (linux)

pip install -r requirements.txt

python manage.py migrate

python manage.py createsuperuser
http://127.0.0.1:8000/
##Frontend Setup########
cd frontend/frontend
npm install
npm run dev
http://localhost:3000/

Environment Variables

Create .env inside backend/

DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=127.0.0.1,localhost

Media Handling

Uploaded product images are stored in:

backend/media/products/
Access pattern:

http://127.0.0.1:8000/media/products/<image_name>

Authentication (Planned)

JWT Authentication

Access & Refresh Tokens

Secure HTTP-only cookies (frontend → backend)

Redis (Planned Use)

API response caching

Session storage

Background jobs (Celery)

Cart & checkout optimization

Gunicorn (Production)

Gunicorn will be used as the WSGI server to run Django behind Nginx.

Example:

gunicorn config.wsgi:application


Gunicorn is NOT a load balancer.
Nginx handles load balancing and reverse proxy.

Docker (Planned)

Docker will be introduced to:

Containerize backend & frontend

Run PostgreSQL & Redis

Standardize deployment

Enable CI/CD pipelines

CI/CD (Planned)

GitHub Actions

Automatic build & test

Auto-deploy to personal VM

Zero-downtime updates

Git Ignore (Important)

Ensure these are ignored:

backend/venv/

backend/.env

backend/db.sqlite3

frontend/node_modules/

frontend/.next/

Status

✅ Product listing
✅ Product detail (slug based)
✅ Image upload & serving
🚧 Auth
🚧 Cart & checkout
🚧 Docker
🚧 CI/CD
🚧 Production deployment

Author

Ashik Mahbub
