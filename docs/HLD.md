# High Level Design (HLD)

## 1. Overview

LakshmiLikhon is a web-based bill/invoice generator designed for a local business. It enables the business owner to create, manage, search, and print bills through a modern web interface.

## 2. Objectives

- Generate professional bills with sequential numbering
- Manage customer and item information
- Calculate totals with percentage-based discounts
- Provide print-ready A4 invoices
- Secure admin access with JWT authentication
- Deploy via Docker containers

## 3. System Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT LAYER                     │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │          Browser (Next.js SPA)                │  │
│  │  ┌─────────┐ ┌──────────┐ ┌───────────────┐   │  │
│  │  │ React   │ │ Tailwind │ │ Framer Motion │   │  │
│  │  │ 18      │ │ CSS      │ │ Animations    │   │  │
│  │  └─────────┘ └──────────┘ └───────────────┘   │  │
│  └───────────────────────┬───────────────────────┘  │
└──────────────────────────┼──────────────────────────┘
                           │ HTTP/HTTPS
                           │ (API calls)
┌──────────────────────────┼───────────────────────────┐
│                    API LAYER                         │
│  ┌───────────────────────┴────────────────────────┐  │
│  │          Express.js Server (Port 3000)         │  │
│  │  ┌─────────┐ ┌──────────┐ ┌───────────────┐    │  │
│  │  │ JWT     │ │ Rate     │ │ CORS          │    │  │
│  │  │ Auth    │ │ Limiting │ │ Protection    │    │  │
│  │  └─────────┘ └──────────┘ └───────────────┘    │  │
│  │  ┌─────────┐ ┌──────────┐ ┌───────────────┐    │  │
│  │  │ Routes  │ │Services  │ │ Repositories  │    │  │
│  │  └─────────┘ └──────────┘ └───────────────┘    │  │
│  └───────────────────────┬────────────────────────┘  │
└──────────────────────────┼───────────────────────────┘
                           │ TCP (port 5432)
┌──────────────────────────┼──────────────────────────┐
│                  DATABASE LAYER                     │
│  ┌───────────────────────┴────────────────────────┐ │
│  │       PostgreSQL 16 (Docker Container)         │ │
│  │  ┌─────────┐ ┌──────────┐ ┌───────────────┐    │ │
│  │  │ bills   │ │bill_items│ │ admin_users   │    │ │
│  │  └─────────┘ └──────────┘ └───────────────┘    │ │
│  └───────────────────────┬────────────────────────┘ │
│  ┌───────────────────────┴────────────────────────┐ │
│  │          Docker Volume (pgdata)                │ │
│  │          Persistent Data Storage               │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

## 4. Service Decomposition

| Service | Technology | Port | Responsibility |
|---------|-----------|------|----------------|
| Frontend | Next.js 14 | 3001 | UI rendering, client-side routing, state management |
| API | Express.js | 3000 | Business logic, authentication, data validation |
| Database | PostgreSQL 16 | 5432 | Data persistence, ACID transactions |

## 5. Data Flow

### Bill Creation Flow

```bash
User → Frontend Form → API Request → Validation → Database Transaction → Response → UI Update
```

1. User fills customer info and items
2. Frontend calculates subtotal, discount, total (client-side)
3. API receives request with auth cookie
4. Auth middleware verifies JWT
5. Service layer validates data
6. Repository creates bill + items in transaction
7. PostgreSQL sequence generates bill number
8. Response returned to frontend
9. Frontend navigates to bill view

### Authentication Flow

```bash
Login Page → POST /api/auth/login → Verify Password → Set httpOnly Cookie → Redirect to Dashboard
```

## 6. Security Model

| Layer | Mechanism |
|-------|-----------|
| Transport | HTTPS (production), CORS policy |
| Authentication | JWT in httpOnly cookies |
| Authorization | Middleware on protected routes |
| Input Validation | Server-side validation on all endpoints |
| SQL | Parameterized queries (no injection) |
| Headers | Helmet.js security headers |
| Secrets | Environment variables, never committed |

## 7. Deployment Options

### Local Development

```bash
Docker Compose → 3 containers → localhost access
```

### Production (AWS EC2)

```bash
EC2 Instance → Docker Compose → Same 3 containers → Public IP/Domain
```

### Future (Terraform)

```bash
Terraform → VPC + EC2 + Security Groups → Automated deployment
```

## 8. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Availability | Single instance, Docker restart policy |
| Durability | Docker volume persistence |
| Performance | < 200ms API response time |
| Scalability | Vertical (single instance) |
| Security | JWT + bcrypt + Helmet |
