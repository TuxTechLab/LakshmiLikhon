# LakshmiLikhon

A modern web-based bill/invoice generator for a home-based cloth business, built with Next.js, Express.js, and PostgreSQL.

## Architecture

```shell
Browser
   |
   v
Next.js Frontend (React + Tailwind + Framer Motion)
   |
   v
Express.js API (JWT Auth + CRUD)
   |
   v
PostgreSQL Database
   |
   v
Docker Persistent Volume
```

## Tech Stack

- **Frontend:** Next.js 14, React 18, Tailwind CSS, Framer Motion
- **Backend:** Node.js + Express.js
- **Auth:** JWT (httpOnly cookies) + bcryptjs
- **Database:** PostgreSQL 16
- **Containerization:** Docker + Docker Compose (3 services)
- **Font:** Inter (Google Fonts)

## Features

- Create bills with customer info and multiple items
- Sequential bill numbers (BILL-000001, BILL-000002, ...)
- Automatic subtotal, discount, and total calculation
- Bill history with search
- Print-friendly A4 invoice layout (no UI elements)
- Light/dark mode toggle
- Currency toggle (Rs, $, EUR, GBP, Tk)
- Business name, address, GSTIN on invoices
- IST date/time on printed bills
- Admin login/logout with JWT authentication
- Smooth page transitions and animations (Framer Motion)
- Modern UI with Tailwind CSS
- Responsive design (mobile + desktop)
- Toast notifications
- Persistent data with Docker volumes
- Management script for easy Docker operations

## Prerequisites

- Docker and Docker Compose

## Quick Start

1. Clone the repository:

   ```shell
   git clone <repo-url>
   cd LakshmiLikhon
   ```

2. Create your environment file:

   ```shell
   cp .env.example .env
   ```

3. Edit `.env` with your settings (especially `DB_PASSWORD`, `JWT_SECRET`, `ADMIN_PASSWORD`, and `BUSINESS_NAME`).

4. Start using the management script:

   ```shell
   ./manage.sh start
   ```

5. Open http://localhost:3001 in your browser (Next.js frontend).

6. Access the admin panel at http://localhost:3001/login with your `ADMIN_PASSWORD`.

## Management Script

The `manage.sh` script provides easy Docker operations:

```shell
./manage.sh start      # Start all services (frontend, api, db)
./manage.sh stop       # Stop all services
./manage.sh restart    # Restart all services
./manage.sh status     # Show container status
./manage.sh logs       # Tail logs (all or specific service)
./manage.sh build      # Rebuild Docker images
./manage.sh fresh      # Remove everything and start fresh (deletes data!)
./manage.sh test       # Run tests
./manage.sh help       # Show help
```

## Environment Variables

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

## API Endpoints

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check (verifies DB connection) |
| GET | /api/config | Get business configuration |

### Admin (JWT Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Admin login |
| POST | /api/auth/logout | Admin logout |
| GET | /api/auth/me | Get current admin user |
| POST | /api/bills | Create a new bill |
| GET | /api/bills | List all bills |
| GET | /api/bills/:id | Get bill details with items |
| GET | /api/bills/search?q=term | Search bills |

## Currency Support

Toggle between currencies using the currency buttons in the navbar:

- **Rs** - Indian Rupee (default)
- **$** - US Dollar
- **EUR** - Euro
- **GBP** - British Pound
- **Tk** - Bangladeshi Taka

Your preference is saved in localStorage.

## Printing

Click "Print Bill" on any bill view to get a clean, print-optimized layout:
- Business name, address, and GSTIN displayed
- IST date/time shown
- No navigation, buttons, or UI chrome
- A4 paper optimized
- Professional invoice format

## Running Tests

```shell
# Unit tests
node --test tests/unit/helpers.test.js

# All tests
node --test tests/**/*.test.js

# Or use manage script
./manage.sh test
```

## Project Structure

```shell
LakshmiLikhon/
├── frontend/              # Next.js application
│   ├── app/               # App Router pages
│   ├── components/        # Reusable React components
│   ├── lib/               # Utilities, API client, auth helpers
│   ├── tailwind.config.ts
│   ├── next.config.js
│   ├── package.json
│   └── Dockerfile
│
├── src/                   # Express.js API
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
├── Dockerfile             # Express API Dockerfile
├── manage.sh
├── plan.md
├── loop.md
├── README.md
└── AGENT.md
```

## Data Persistence

PostgreSQL data is stored in a Docker volume (`pgdata`). Bills persist across container restarts.

## Terraform (Planned)

AWS infrastructure automation will be added in a later phase. See `terraform/README.md`.
