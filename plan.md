# LakshmiLikhon - Implementation Plan

## 1. Project Overview

Build a modern web-based bill/invoice generator for a home-based cloth business with an admin panel, animations, and a polished UI.

The application runs as Docker containers and is usable in two environments:

### Local

Laptop → Docker Compose → Next.js Frontend → Express.js API → PostgreSQL

### AWS

AWS EC2 → Docker Compose → Next.js Frontend → Express.js API → PostgreSQL

Terraform-based AWS infrastructure will be implemented in a later phase.

---

# 2. Goals

The production-ready version should allow the business owner to:

- Create bills with customer info and multiple items.
- Automatically generate sequential bill numbers.
- Calculate item totals, subtotal, discount, and final amount.
- Save, view, search, and print bills.
- Switch between light and dark mode.
- Toggle currency between Rs, $, EUR, GBP, Tk.
- Display business name, address, GSTIN on printed invoices.
- Show date/time in IST (Indian Standard Time).
- Log in as admin to access protected features.
- Enjoy smooth animations and a modern UI.
- Use a management script (`manage.sh`) for easy Docker operations.

---

# 3. Non-Goals

Do not implement:

- Multi-user roles (single admin only).
- Online payments.
- Inventory management.
- Customer accounts.
- GST filing / accounting integration.
- WhatsApp / email integration.
- Kubernetes / microservices.
- AWS RDS (use Docker PostgreSQL).
- Complex analytics / mobile application.

---

# 4. Technology Stack

## Frontend

- **Next.js 14** (App Router, React 18)
- **Tailwind CSS** (utility-first styling)
- **Framer Motion** (animations)
- **Google Fonts** (Inter)

## Backend

- **Node.js** + **Express.js** (API server)
- **jsonwebtoken** + **bcryptjs** (admin auth)
- **helmet** (security headers)
- **dotenv** (config)

## Database

- **PostgreSQL 16**

## Containerization

- **Docker** + **Docker Compose** (3 services: nextjs, express, postgres)

## Infrastructure

- **Terraform** (later phase)

---

# 5. High-Level Architecture

```text
                  Browser
                     |
                     v
          +---------------------+
          |   Next.js Frontend  |  ← Port 3001 (internal)
          |   (React + Tailwind |
          |    + Framer Motion) |
          +----------+----------+
                     |
                     | API calls
                     v
          +---------------------+
          |  Express.js API     |  ← Port 3000 (internal)
          |  (JWT Auth + CRUD)  |
          +----------+----------+
                     |
                     v
          +---------------------+
          | PostgreSQL Database  |
          | (Docker Container)  |
          +----------+----------+
                     |
                     v
              Docker Volume
              Persistent Data
```

Docker Compose manages:

- `frontend` container (Next.js)
- `api` container (Express.js)
- `db` container (PostgreSQL)
- Internal network
- Persistent database volume
- Environment variables

---

# 6. UI/UX Design

## Modern Design System (Tailwind CSS)

- Inter font family for clean typography
- Tailwind CSS utility classes for rapid styling
- CSS custom properties for theme colors
- Light and dark mode with smooth transitions
- Card-based layout with subtle shadows
- Responsive design (mobile-first)
- Professional neutral color palette

## Animations (Framer Motion)

- Page transition animations (fade + slide)
- Card hover effects (scale + shadow)
- Button press feedback
- Loading skeleton animations
- Toast notification slide-in/out
- Staggered list animations
- Form field focus animations
- Modal backdrop blur + scale

## Currency Support

Toggle between currencies in the navbar:
- Rs (Indian Rupee) - default
- $ (US Dollar)
- EUR (Euro)
- GBP (British Pound)
- Tk (Bangladeshi Taka)

Currency preference saved in localStorage.

## Print Layout

- Clean A4-optimized layout
- Business name, address, GSTIN displayed
- No navigation, buttons, or UI chrome
- IST date/time shown on invoices
- Professional invoice format

---

# 7. Admin Panel

## Authentication

- Single admin account (password from environment variable)
- JWT tokens stored in httpOnly cookies
- Protected API routes with middleware
- Login page with form validation

## Admin Features

- Admin login/logout
- Protected dashboard view
- Bill management (CRUD)
- Future: settings, user management

## Database Schema (new tables)

```sql
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

# 8. Management Script

The `manage.sh` script provides easy Docker operations:

```bash
./manage.sh start      # Start all services
./manage.sh stop       # Stop all services
./manage.sh restart    # Restart all services
./manage.sh status     # Show container status
./manage.sh logs       # Tail logs (all or specific service)
./manage.sh build      # Rebuild Docker images
./manage.sh fresh      # Remove everything and start fresh
./manage.sh test       # Run tests
./manage.sh help       # Show help
```

---

# 9. Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| NEXT_PUBLIC_API_URL | http://localhost:3000 | Express API URL |
| API_PORT | 3000 | Express API port |
| FRONTEND_PORT | 3001 | Next.js frontend port |
| DB_HOST | db | Database host |
| DB_PORT | 5432 | Database port |
| DB_NAME | billing | Database name |
| DB_USER | billing_user | Database user |
| DB_PASSWORD | change_me | Database password |
| NODE_ENV | development | Environment |
| JWT_SECRET | change_me_too | JWT signing secret |
| ADMIN_PASSWORD | admin123 | Admin login password |
| BUSINESS_NAME | Your Business Name | Business name for invoices |
| BUSINESS_ADDRESS | 123 Main Street, City | Business address |
| BUSINESS_PHONE | +1234567890 | Business phone |
| BUSINESS_EMAIL | business@example.com | Business email |
| BUSINESS_GSTIN | 22AAAAA0000A1Z5 | GST Identification Number |

---

# 10. API Endpoints

## Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check (verifies DB connection) |
| GET | /api/config | Get business configuration |

## Admin (JWT Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Admin login (returns JWT cookie) |
| POST | /api/auth/logout | Admin logout (clears cookie) |
| GET | /api/auth/me | Get current admin user |
| POST | /api/bills | Create a new bill |
| GET | /api/bills | List all bills |
| GET | /api/bills/:id | Get bill details with items |
| GET | /api/bills/search?q=term | Search bills |

---

# 11. Project Structure

```
LakshmiLikhon/
├── frontend/                  # Next.js application
│   ├── app/                   # App Router pages
│   │   ├── layout.tsx         # Root layout with providers
│   │   ├── page.tsx           # Dashboard
│   │   ├── bills/
│   │   │   ├── new/page.tsx   # Create bill
│   │   │   ├── [id]/page.tsx  # View bill
│   │   │   └── page.tsx       # Bill history
│   │   ├── login/page.tsx     # Admin login
│   │   └── admin/
│   │       └── page.tsx       # Admin panel
│   ├── components/            # Reusable React components
│   ├── lib/                   # Utilities, API client, auth helpers
│   ├── public/                # Static assets
│   ├── tailwind.config.ts     # Tailwind configuration
│   ├── next.config.js         # Next.js configuration
│   ├── package.json
│   └── Dockerfile
│
├── src/                       # Express.js API (unchanged structure)
│   ├── server.js
│   ├── config/
│   ├── db/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── middleware/
│   └── utils/
│
├── migrations/
├── tests/
├── terraform/
├── docker-compose.yml
├── Dockerfile                 # Express API Dockerfile
├── manage.sh
├── plan.md
├── loop.md
├── README.md
├── AGENT.md
└── .env.example
```

---

# 12. Implementation Phases

## Phase 1: Project Setup
- Initialize Next.js project with TypeScript
- Configure Tailwind CSS
- Set up Framer Motion
- Create Docker configuration for frontend

## Phase 2: Admin Authentication
- Add admin_users table migration
- Implement JWT auth (login, logout, me endpoints)
- Create auth middleware for protected routes
- Build login page with form validation

## Phase 3: Frontend Migration
- Recreate Dashboard with Next.js + Tailwind
- Recreate Create Bill page
- Recreate Bill History page
- Recreate Bill View page
- Add print layout

## Phase 4: Animations
- Page transitions (Framer Motion AnimatePresence)
- Card hover effects
- Loading skeletons
- Toast notifications
- Form animations

## Phase 5: Docker & Deployment
- Update docker-compose.yml (3 services)
- Update Dockerfiles
- Update manage.sh
- Test full stack

## Phase 6: Documentation
- Update README.md
- Update plan.md
- Update loop.md
- Update AGENT.md

---

# 13. Future Enhancements (V3+)

- Multi-user roles and permissions
- Inventory management
- Online payments
- WhatsApp integration
- Email invoices
- GST filing
- AWS deployment with Terraform
- Mobile application
