# Architecture

## 1. System Architecture

```bash
┌─────────────────────────────────────────────────────────────────┐
│                         DOCKER HOST                             │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  docker-compose network                  │   │
│  │                                                          │   │
│  │  ┌─────────────┐   ┌─────────────┐   ┌──────────────┐    │   │
│  │  │  frontend   │   │     api     │   │      db      │    │   │
│  │  │  (Next.js)  │──▶│ (Express.js)│──▶│ (PostgreSQL) │    │   │
│  │  │  Port 3001  │   │  Port 3000  │   │  Port 5432   │    │   │
│  │  └─────────────┘   └─────────────┘   └──────┬───────┘    │   │
│  │         │                │                  │            │   │
│  └─────────┼────────────────┼──────────────────┼────────────┘   │
│            │                │                  │                │
│  ┌─────────┴───┐   ┌────────┴─────┐   ┌────────┴────────┐       │
│  │  Host:3001  │   │  Host:3000   │   │  pgdata volume  │       │
│  │  (Browser)  │   │  (API)       │   │  (Persistent)   │       │
│  └─────────────┘   └──────────────┘   └─────────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 2. Network Architecture

| Service | Container Name | Internal Port | Host Port | Protocol |
|---------|---------------|---------------|-----------|----------|
| Frontend | lakshmilikhon-frontend-1 | 3001 | 3001 | HTTP |
| API | lakshmilikhon-api-1 | 3000 | 3000 | HTTP |
| Database | lakshmilikhon-db-1 | 5432 | - (not exposed) | TCP |

## 3. Data Architecture

```bash
┌─────────────────────────────────────────────────┐
│                  PostgreSQL                     │
│                                                 │
│  ┌──────────────┐       ┌──────────────────┐    │
│  │    bills     │       │   bill_items     │    │
│  │──────────────│       │──────────────────│    │
│  │ id (PK)      │──┐    │ id (PK)          │    │
│  │ bill_number  │  │    │ bill_id (FK)     │    │
│  │ customer_*   │  └───▶│ product_name     │    │
│  │ subtotal     │       │ description      │    │
│  │ discount (%) │       │ quantity         │    │
│  │ total        │       │ unit_price       │    │
│  │ timestamps   │       │ total            │    │
│  └──────────────┘       └──────────────────┘    │
│                                                 │
│  ┌──────────────┐       ┌──────────────────┐    │
│  │ admin_users  │       │ bill_number_seq  │    │
│  │──────────────│       │──────────────────│    │
│  │ id (PK)      │       │ SEQUENCE         │    │
│  │ username     │       │ START 1          │    │
│  │ password_hash│       └──────────────────┘    │
│  │ created_at   │                               │
│  └──────────────┘                               │
└─────────────────────────────────────────────────┘
```

## 4. Authentication Architecture

```bash
┌─────────────────────────────────────────────────────────┐
│                    AUTH FLOW                            │
│                                                         │
│  Browser                API                Database     │
│    │                      │                    │        │
│    │  POST /auth/login    │                    │        │
│    │─────────────────────▶│                    │        │
│    │                      │  SELECT * FROM     │        │
│    │                      │  admin_users       │        │
│    │                      │───────────────────▶│        │
│    │                      │◀───────────────────│        │
│    │                      │                    │        │
│    │                      │  bcrypt.compare()  │        │
│    │                      │  jwt.sign()        │        │
│    │                      │                    │        │
│    │  Set-Cookie: token=  │                    │        │
│    │◀─────────────────────│                    │        │
│    │                      │                    │        │
│    │  GET /bills          │                    │        │
│    │  Cookie: token=...   │                    │        │
│    │─────────────────────▶│                    │        │
│    │                      │  jwt.verify()      │        │
│    │                      │  req.user = decoded│        │
│    │                      │                    │        │
│    │                      │  SELECT bills      │        │
│    │                      │───────────────────▶│        │
│    │                      │◀───────────────────│        │
│    │  Response: bills[]   │                    │        │
│    │◀─────────────────────│                    │        │
└─────────────────────────────────────────────────────────┘
```

## 5. Request Lifecycle

```bash
1. Browser sends HTTP request
2. Docker network routes to appropriate container
3. Frontend: Next.js App Router handles routing
   API: Express middleware chain processes request:
   a. Helmet (security headers)
   b. CORS (cross-origin policy)
   c. Body parser
   d. Cookie parser
   e. Route handler
   f. Auth middleware (if protected route)
   g. Controller → Service → Repository
4. Repository executes parameterized SQL
5. PostgreSQL returns result
6. Response flows back through the chain
7. Browser renders result
```

## 6. Docker Architecture

### Dockerfile (API - Multi-stage not needed)

```bash
node:20-alpine
  ├── npm ci --omit=dev
  ├── Copy src/, migrations/
  ├── Non-root user (appuser)
  └── CMD ["node", "src/server.js"]
```

### Dockerfile (Frontend - Multi-stage)

```bash
Stage 1 (deps):  node:20-alpine → npm ci
Stage 2 (build): node:20-alpine → npm run build
Stage 3 (run):   node:20-alpine → Copy standalone + static
                 Non-root user (nextjs)
                 CMD ["node", "server.js"]
```

### Docker Compose

```bash
services:
  frontend:
    build: ./frontend
    ports: ${FRONTEND_PORT}:3001
    depends_on: api (healthy)

  api:
    build: .
    ports: ${API_PORT}:3000
    depends_on: db (healthy)
    healthcheck: node HTTP check

  db:
    image: postgres:16-alpine
    volumes: pgdata:/var/lib/postgresql/data
    healthcheck: pg_isready
```

## 7. Future Architecture (AWS + Terraform)

```bash
┌───────────────────────────────────────────────────┐
│                    AWS Cloud                      │
│                                                   │
│  ┌──────────────────────────────────────────────┐ │
│  │                  VPC                         │ │
│  │  ┌─────────────────────────────────────────┐ │ │
│  │  │            Public Subnet                │ │ │
│  │  │  ┌──────────┐     ┌─────────────────┐   │ │ │
│  │  │  │   EC2    │     │  Elastic IP     │   │ │ │
│  │  │  │ Instance │◀────│  (Public IP)    │   │ │ │
│  │  │  └──────────┘     └─────────────────┘   │ │ │
│  │  │       │                                 │ │ │
│  │  │       │ Docker Compose                  │ │ │
│  │  │       ├── frontend                      │ │ │
│  │  │       ├── api                           │ │ │
│  │  │       └── db (with EBS volume)          │ │ │
│  │  └─────────────────────────────────────────┘ │ │
│  └──────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────┘
```
