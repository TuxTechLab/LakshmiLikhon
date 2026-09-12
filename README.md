# LakshmiLikhon

A lightweight web-based bill/invoice generator for a home-based cloth business.

## Architecture

```
Browser
   |
   v
Node.js / Express Application
   |
   v
PostgreSQL Database
   |
   v
Docker Persistent Volume
```

## Tech Stack

- **Backend:** Node.js + Express.js
- **Frontend:** HTML + CSS + Vanilla JavaScript
- **Database:** PostgreSQL 16
- **Containerization:** Docker + Docker Compose
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
- Toast notifications
- Modern UI with SVG icons
- Persistent data with Docker volumes
- Management script for easy Docker operations

## Prerequisites

- Docker and Docker Compose

## Quick Start

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd LakshmiLikhon
   ```

2. Create your environment file:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` with your settings (especially `DB_PASSWORD`, `BUSINESS_NAME`, and `BUSINESS_GSTIN`).

4. Start using the management script:
   ```bash
   ./manage.sh start
   ```

5. Open http://localhost:3000 in your browser.

## Management Script

The `manage.sh` script provides easy Docker operations:

```bash
./manage.sh start      # Start the application
./manage.sh stop       # Stop the application
./manage.sh restart    # Restart the application
./manage.sh status     # Show container status
./manage.sh logs       # Tail application logs
./manage.sh build      # Rebuild Docker images
./manage.sh fresh      # Remove everything and start fresh (deletes data!)
./manage.sh test       # Run unit tests
./manage.sh help       # Show help
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| APP_PORT | 3000 | Application port |
| DB_HOST | db | Database host |
| DB_PORT | 5432 | Database port |
| DB_NAME | billing | Database name |
| DB_USER | billing_user | Database user |
| DB_PASSWORD | change_me | Database password |
| NODE_ENV | development | Environment |
| BUSINESS_NAME | Your Business Name | Business name for invoices |
| BUSINESS_ADDRESS | 123 Main Street, City | Business address |
| BUSINESS_PHONE | +1234567890 | Business phone |
| BUSINESS_EMAIL | business@example.com | Business email |
| BUSINESS_GSTIN | 22AAAAA0000A1Z5 | GST Identification Number |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check (verifies DB connection) |
| GET | /api/config | Get business configuration |
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

```bash
# Unit tests
node --test tests/unit/helpers.test.js

# All tests
node --test tests/**/*.test.js

# Or use manage script
./manage.sh test
```

## Data Persistence

PostgreSQL data is stored in a Docker volume (`pgdata`). Bills persist across container restarts.

## Terraform (Planned)

AWS infrastructure automation will be added in a later phase. See `terraform/README.md`.
