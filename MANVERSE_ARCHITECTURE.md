# Manverse — Full Project Architecture & Structure

> **Use this document to onboard any AI assistant (ChatGPT, Gemini, Claude, etc.) to continue development on Manverse.**
> Paste this entire file at the start of any new AI conversation.

---

## 🧑‍💻 Developer

- **Name:** Ashik Mahbub (Legal: Abdur Rahman Ashik)
- **Role:** Full Stack Developer & Systems Administrator
- **Stack:** Django + Next.js + PostgreSQL + Redis + Celery + Docker
- **VPS:** 103.102.46.200 (sin-monitor01, Kamatera Singapore)
- **GitHub:** github.com/Ashikmahbub/manverse
- **Portfolio:** ashikmahbub-dev.vercel.app

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    PRODUCTION VPS                    │
│                  103.102.46.200                      │
│                                                      │
│  ┌──────────┐    ┌──────────────────────────────┐   │
│  │  Nginx   │    │        Docker Network         │   │
│  │  :80     │───▶│  ┌──────────┐ ┌───────────┐  │   │
│  │          │    │  │ Frontend │ │  Backend  │  │   │
│  │ /api/chat│───▶│  │ Next.js  │ │  Django   │  │   │
│  │ → :3000  │    │  │ :3000    │ │  :8000    │  │   │
│  │          │    │  └──────────┘ └───────────┘  │   │
│  │ /api/    │───▶│  ┌──────────┐ ┌───────────┐  │   │
│  │ → :8000  │    │  │ Postgres │ │   Redis   │  │   │
│  │          │    │  │ :5432    │ │   :6379   │  │   │
│  │ /        │───▶│  └──────────┘ └───────────┘  │   │
│  │ → :3000  │    │  ┌──────────┐ ┌───────────┐  │   │
│  └──────────┘    │  │  Celery  │ │  Migrate  │  │   │
│                  │  │ Worker   │ │ (on boot) │  │   │
│                  │  └──────────┘ └───────────┘  │   │
│                  └──────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## 📁 Full Project Structure

```
manverse/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions CI/CD
│
├── backend/
│   ├── Dockerfile                  # Python 3.12 + gunicorn
│   ├── requirements.txt            # All Python dependencies
│   └── config/                     # Django project root
│       ├── manage.py
│       ├── config/                 # Django config module
│       │   ├── __init__.py         # imports celery app
│       │   ├── settings.py         # all settings
│       │   ├── urls.py             # root URL config
│       │   ├── wsgi.py
│       │   ├── asgi.py
│       │   └── celery.py           # Celery app config
│       │
│       ├── products/               # Products app
│       │   ├── models.py           # Product, Category, ProductVariant
│       │   ├── views.py            # ProductListView, ProductDetailView, CategoryListView
│       │   ├── serializers.py      # ProductSerializer
│       │   ├── urls.py
│       │   └── admin.py
│       │
│       ├── orders/                 # Orders app
│       │   ├── models.py           # Order, OrderItem
│       │   ├── views.py            # SSLCommerz views + COD + History
│       │   ├── stripe_views.py     # Stripe payment views
│       │   ├── sslcommerz.py       # SSLCommerz API wrapper
│       │   ├── tasks.py            # Celery email tasks
│       │   ├── invoice.py          # PDF invoice generator
│       │   ├── urls.py
│       │   └── admin.py
│       │
│       ├── users/                  # Users app
│       │   ├── views.py            # Register, Login, Profile, OrderHistory
│       │   ├── urls.py
│       │   └── admin.py
│       │
│       └── templates/
│           └── orders/
│               ├── email_invoice.html
│               ├── email_invoice.txt
│               ├── email_admin.html
│               ├── email_admin.txt
│               └── email_status_*.html
│
├── frontend/
│   └── frontend/                   # Next.js 16 project
│       ├── Dockerfile              # Node 22 Alpine + next build
│       ├── package.json
│       ├── next.config.ts
│       ├── tsconfig.json
│       ├── tailwind.config.ts
│       └── app/
│           ├── layout.tsx          # Root: Navbar, Footer, ChatBox, CartProvider
│           ├── page.tsx            # Homepage
│           ├── globals.css
│           │
│           ├── store/
│           │   └── cartStore.tsx   # Cart context (cart, addToCart, clearCart, totalPrice)
│           │
│           ├── api/
│           │   └── chat/
│           │       └── route.ts    # Groq AI chatbot (llama-3.1-8b-instant)
│           │
│           ├── components/
│           │   ├── Navbar.tsx      # Nav with search dropdown, hamburger
│           │   ├── Footer.tsx
│           │   ├── ChatBox.tsx     # AI chat widget
│           │   └── home/
│           │       ├── Hero.tsx
│           │       ├── Categories.tsx
│           │       ├── ProductCard.tsx
│           │       ├── Featured.tsx
│           │       ├── Trending.tsx
│           │       ├── NewArrivals.tsx
│           │       ├── Banner.tsx
│           │       ├── USPStrip.tsx
│           │       ├── Marquee.tsx
│           │       └── Newsletter.tsx
│           │
│           ├── shop/
│           │   └── page.tsx        # Gender tabs + category pills + search + sort
│           │
│           ├── products/
│           │   └── [slug]/
│           │       ├── page.tsx    # Server component, product detail
│           │       └── AddToCart.tsx
│           │
│           ├── cart/
│           │   └── page.tsx
│           │
│           ├── checkout/
│           │   └── page.tsx        # SSLCommerz + Stripe payment toggle
│           │
│           ├── order-success/
│           │   └── page.tsx        # Polls order status, shows details
│           │
│           ├── order-fail/
│           │   └── page.tsx
│           │
│           ├── login/
│           │   └── page.tsx
│           │
│           ├── register/
│           │   └── page.tsx
│           │
│           └── profile/
│               └── page.tsx        # Account info + order history tabs
│
├── docker-compose.yml              # All services definition
├── .env                            # Environment variables (not in git)
└── .gitignore
```

---

## 🐳 Docker Services

```yaml
# docker-compose.yml services:

db:        postgres:16    → port 5432 (internal)
redis:     redis:7        → port 6379 (internal)
migrate:   manverse-migrate → runs on deploy, exits after success
backend:   manverse-backend → port 8000, waits for migrate
celery:    manverse-backend → runs celery worker, waits for migrate
frontend:  manverse-frontend → port 3000, waits for backend
```

**Startup order:**
```
db + redis → migrate → backend + celery → frontend
```

---

## 🔌 API Endpoints

### Products
```
GET  /api/products/                 # List products (filter: category, gender, search, sort)
GET  /api/products/categories/      # Gender tabs + sub categories
GET  /api/products/<slug>/          # Product detail
```

### Orders
```
POST /api/orders/payment/initiate/  # SSLCommerz — create order + get payment URL
POST /api/orders/payment/success/   # SSLCommerz callback (CSRF exempt)
POST /api/orders/payment/fail/      # SSLCommerz callback (CSRF exempt)
POST /api/orders/payment/cancel/    # SSLCommerz callback (CSRF exempt)
POST /api/orders/payment/ipn/       # SSLCommerz IPN backup (CSRF exempt)
GET  /api/orders/status/<tran_id>/  # Check order status
GET  /api/orders/history/           # User order history
GET  /api/orders/detail/<tran_id>/  # Single order detail
POST /api/orders/create/            # Cash on Delivery order
POST /api/orders/stripe/create-payment/  # Stripe — create payment intent
POST /api/orders/stripe/confirm/         # Stripe — confirm payment
POST /api/orders/stripe/webhook/         # Stripe webhook (CSRF exempt)
```

### Users
```
POST /api/users/register/           # Register
POST /api/users/login/              # Login (returns JWT tokens)
POST /api/users/token/refresh/      # Refresh JWT token
GET  /api/users/profile/            # Get user profile
```

### AI Chat (Next.js API route)
```
POST /api/chat                      # Groq AI chatbot
```

---

## 🗄️ Database Models

### Product App
```python
Category:
  id, name, slug, gender (men/women/kids), parent (ForeignKey self)

Product:
  id, name, slug, description, price, category (FK),
  is_active, created_at

ProductVariant:
  id, product (FK), size, color, stock
```

### Orders App
```python
Order:
  id, user (FK User), full_name, phone, address, city, postcode
  total_amount, delivery_charge (60 Dhaka / 120 outside)
  status (PENDING/PAID/FAILED/CANCELLED/SHIPPED/DELIVERED/REFUNDED)
  payment_method (sslcommerz/stripe/cod)
  tran_id (unique), val_id, bank_tran_id
  created_at, updated_at

OrderItem:
  id, order (FK), product (CharField), size, color,
  price, quantity
  property: subtotal
```

### Users App
```
Uses Django's built-in User model
```

---

## ⚙️ Settings Summary

```python
# Key settings in backend/config/config/settings.py

DATABASES:      PostgreSQL via env vars (DB_HOST, DB_NAME, DB_USER, DB_PASSWORD)
CACHES:         Redis (REDIS_URL)
CELERY_BROKER:  Redis (REDIS_URL)

REST_FRAMEWORK: JWT authentication (djangorestframework-simplejwt)
JWT:            Access 60min, Refresh 7 days

CORS:           django-cors-headers (allow all in dev)
STATIC:         WhiteNoise + STATIC_ROOT = staticfiles/
MEDIA:          /app/config/media/

# Payment
SSLCOMMERZ_STORE_ID
SSLCOMMERZ_STORE_PASSWORD
SSLCOMMERZ_IS_LIVE          (False=sandbox, True=live)
STRIPE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET

# URLs
BACKEND_BASE_URL            (http://103.102.46.200)
FRONTEND_BASE_URL           (http://103.102.46.200)

# Email
EMAIL_HOST_USER
EMAIL_HOST_PASSWORD
ADMIN_EMAIL
DEFAULT_FROM_EMAIL

# AI
GROQ_API_KEY                (used in Next.js api/chat route)
```

---

## 🔄 CI/CD Pipeline

```
Developer pushes to GitHub (main branch)
         ↓
GitHub Actions triggers deploy-manverse workflow
         ↓
Self-hosted runner on VPS (github-runner user)
Location: /var/www/manverse/actions-runner/
Service:  actions.runner.Ashikmahbub-manverse.sin-monitor01.service
         ↓
Steps:
1. git pull origin main
2. docker compose build migrate backend frontend
3. docker compose up -d
4. docker image prune -f
         ↓
Containers restart with new code ✅
```

---

## 🌐 Nginx Config

```nginx
# /etc/nginx/sites-available/manverse

server {
    listen 80;
    server_name 103.102.46.200;

    # AI chat (Next.js API) — must be before /api/
    location /api/chat {
        proxy_pass http://localhost:3000;
    }

    # Django backend
    location /api/ {
        proxy_pass http://localhost:8000;
    }

    # Django admin
    location /admin/ {
        proxy_pass http://localhost:8000;
    }

    # Static files
    location /static/ {
        alias /home/manverse/static/;
    }

    # Media files
    location /media/ {
        alias /home/manverse/media/;
    }

    # Next.js frontend (everything else)
    location / {
        proxy_pass http://localhost:3000;
    }
}
```

---

## 📦 Key Dependencies

### Backend (requirements.txt)
```
Django>=6.0
djangorestframework
djangorestframework-simplejwt
psycopg2-binary
django-cors-headers
gunicorn
celery
redis
django-celery-results
requests              # SSLCommerz API calls
stripe                # Stripe payments
Pillow                # Image processing
python-dotenv
whitenoise            # Static files
```

### Frontend (package.json key deps)
```
next 16
react
typescript
tailwindcss
@stripe/stripe-js
@stripe/react-stripe-js
groq-sdk              # AI chatbot
zustand or context    # State (uses React Context for cart)
```

---

## 💳 Payment Flow

### SSLCommerz (BDT — Bangladesh)
```
1. POST /api/orders/payment/initiate/
   → Django creates Order (PENDING)
   → Calls SSLCommerz API
   → Returns payment_url

2. User redirected to SSLCommerz page
   → Pays via bKash/Nagad/card/net banking

3. SSLCommerz POSTs to /payment/success/
   → Django validates with SSLCommerz
   → Order marked PAID
   → Celery sends confirmation email

4. User redirected to /order-success?tran_id=xxx
```

### Stripe (USD — International)
```
1. POST /api/orders/stripe/create-payment/
   → Django creates Order (PENDING)
   → Creates Stripe PaymentIntent
   → Returns client_secret

2. Frontend uses @stripe/react-stripe-js
   → User enters card on your page (no redirect)
   → stripe.confirmCardPayment(client_secret)

3. POST /api/orders/stripe/confirm/
   → Django verifies with Stripe
   → Order marked PAID
   → Celery sends confirmation email

4. Webhook /api/orders/stripe/webhook/ (backup)
```

### Cash on Delivery
```
1. POST /api/orders/create/
   → Django creates Order (PENDING, payment_method=cod)
   → Celery sends confirmation email immediately
   → Returns order_code
```

---

## 📧 Email System (Celery Tasks)

```python
# tasks.py

send_order_emails(order_id)
  → Generates PDF invoice
  → Sends HTML email to customer
  → Sends HTML email to admin
  → Both include PDF attachment

send_status_email(order_id, new_status)
  → Triggered when admin changes order status
  → Sends status-specific email template
  → Templates: PAID, SHIPPED, DELIVERED, CANCELLED, REFUNDED, FAILED
```

---

## 🤖 AI Chatbot

```typescript
// frontend/app/api/chat/route.ts
// Uses Groq API with llama-3.1-8b-instant model
// Endpoint: POST /api/chat
// Body: { message: string, history: [] }
// Returns: { response: string }
```

---

## 🛒 Cart System

```typescript
// frontend/app/store/cartStore.tsx
// React Context (NOT Zustand)
// Persisted to localStorage key: "manverse_cart"

CartItem: {
  id, name, price, image_url, slug,
  size, color, quantity
}

CartContextType: {
  cart: CartItem[]
  addToCart(item)
  removeFromCart(id, size, color)
  updateQuantity(id, size, color, quantity)
  clearCart()
  totalItems: number
  totalPrice: number
}
```

---

## 🔐 Authentication

```
JWT Authentication via djangorestframework-simplejwt

Login  → POST /api/users/login/  → { access, refresh }
Stored in: localStorage("token") and localStorage("refresh_token")
Headers:   Authorization: Bearer <access_token>
Refresh:   POST /api/users/token/refresh/ → { access }
```

---

## 🚀 Delivery Charge Logic

```python
def calc_delivery_charge(city: str) -> int:
    return 60 if city.strip().lower() == "dhaka" else 120
```

---

## 🌍 Environment Variables (.env)

```env
# Database
POSTGRES_DB=manverse_db
POSTGRES_USER=manverse_user
POSTGRES_PASSWORD=Manverse@123

# Django
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=103.102.46.200

# Redis
REDIS_URL=redis://redis:6379/1

# URLs
BACKEND_BASE_URL=http://103.102.46.200
FRONTEND_BASE_URL=http://103.102.46.200
NEXT_PUBLIC_API_URL=http://103.102.46.200

# Payment
SSLCOMMERZ_STORE_ID=
SSLCOMMERZ_STORE_PASSWORD=
SSLCOMMERZ_IS_LIVE=False
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=

# Email
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
ADMIN_EMAIL=
DEFAULT_FROM_EMAIL=

# AI
GROQ_API_KEY=gsk_xxx

# Frontend Stripe
NEXT_PUBLIC_STRIPE_KEY=pk_test_xxx
```

---

## ⚠️ Known Issues & Notes

```
1. Runner must run as github-runner user (not root)
   Service: actions.runner.Ashikmahbub-manverse.sin-monitor01.service

2. After VPS reboot — runner starts automatically (service enabled)
   Docker containers also restart automatically (restart: always)

3. Nginx /api/chat must be BEFORE /api/ in config
   Otherwise Next.js chat route gets proxied to Django

4. CartStore uses "cart" not "items"
   Always destructure: const { cart, totalPrice, clearCart } = useCart()

5. SSLCommerz works on IP (sandbox)
   For live account — needs domain + SSL + trade license

6. Celery tasks use relative imports:
   from .tasks import send_order_emails  (NOT from orders.tasks)

7. Static files served from:
   Host: /home/manverse/static/
   Container: /app/config/staticfiles/
   Mounted as volume in docker-compose
```

---

## 🗺️ Roadmap / Pending Features

```
[ ] SSL certificate + custom domain (manverse.xyz)
[ ] SSLCommerz live account (needs domain + trade license)
[ ] Product image upload in admin
[ ] Inventory/stock management
[ ] Admin dashboard for order management
[ ] Product reviews and ratings
[ ] Wishlist feature
[ ] Promo codes / discounts
[ ] FastAPI AI microservice (port 8001)
[ ] URL Shortener microservice (port 8002)
[ ] PWA support
```

---

## 💡 How to Continue Development

When starting a new AI chat session, paste this document and say:

> "I'm continuing development on Manverse. Here's the full architecture.
> I need help with: [your task]"

The AI will have full context about:
- All models, views, URLs
- Payment flow
- Docker setup
- CI/CD pipeline
- Cart system
- Authentication
- Email system
