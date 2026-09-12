# LakshmiLikhon - Implementation Plan

## 1. Project Overview

Build a lightweight web-based bill/invoice generator for a home-based cloth business.

The application will run as Docker containers and must be usable in two environments:

### Local

Laptop
→ Docker Compose
→ Node.js Application
→ PostgreSQL

### AWS

AWS EC2
→ Docker Compose
→ Node.js Application
→ PostgreSQL

Terraform-based AWS infrastructure will be implemented in a later phase.

---

# 2. Goals

The first production-ready version should allow the business owner to:

- Create bills.
- Automatically generate sequential bill numbers.
- Add customer information.
- Add multiple clothing/product items.
- Calculate item totals.
- Calculate subtotal.
- Apply discount.
- Calculate final amount.
- Save bills.
- View bill history.
- Search bills.
- View individual bills.
- Print bills (clean A4 print layout, no UI elements).
- Switch between light and dark mode.
- Toggle currency between Rs, $, EUR, GBP, Tk.
- Display business name, address, GSTIN on printed invoices.
- Show date/time in IST (Indian Standard Time).
- Use a management script (`manage.sh`) for easy Docker operations.

The application should be simple enough for a non-technical business owner to use.

---

# 3. Non-Goals for V1

Do not implement these initially:

- User authentication.
- Multi-user roles.
- Online payments.
- Inventory management.
- Customer accounts.
- GST filing.
- Accounting integration.
- WhatsApp integration.
- Email invoices.
- Kubernetes.
- Microservices.
- AWS RDS.
- Complex analytics.
- Mobile application.
- React/Vue/Angular frontend.

These can be considered in future versions.

---

# 4. Technology Stack

## Application

Node.js + Express.js

## Frontend

HTML
CSS
Vanilla JavaScript
Google Fonts (Inter)

## Database

PostgreSQL

## Containerization

Docker
Docker Compose

## Infrastructure

Terraform

Terraform is a later implementation phase.

---

# 5. High-Level Architecture

```text
                  Browser
                     |
                     |
                     v
          +---------------------+
          | Node.js / Express   |
          | Application         |
          +----------+----------+
                     |
                     |
                     v
          +---------------------+
          | PostgreSQL           |
          | Database Container   |
          +----------+----------+
                     |
                     |
                     v
             Docker Volume
             Persistent Data
```

---

# 6. UI/UX Design

## Modern Design System

- Inter font family for clean typography
- CSS custom properties for theming
- Light and dark mode with smooth transitions
- Card-based layout with subtle shadows
- SVG icons throughout the interface
- Toast notifications for user feedback
- Animated page transitions

## Currency Support

Toggle between currencies in the navbar:
- Rs (Indian Rupee) - default
- $ (US Dollar)
- EUR (Euro)
- GBP (British Pound)
- Tk (Bangladeshi Taka)

Currency preference is saved in localStorage.

## Print Layout

- Clean A4-optimized layout
- Business name, address, GSTIN displayed
- No navigation, buttons, or UI chrome
- IST date/time shown on invoices
- Professional invoice format

---

# 7. Management Script

The `manage.sh` script provides easy Docker operations:

```bash
./manage.sh start      # Start the application
./manage.sh stop       # Stop the application
./manage.sh restart    # Restart the application
./manage.sh status     # Show container status
./manage.sh logs       # Tail application logs
./manage.sh build      # Rebuild Docker images
./manage.sh fresh      # Remove everything and start fresh
./manage.sh test       # Run unit tests
./manage.sh help       # Show help
```

---

# 8. Environment Variables

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

---

# 9. API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check (verifies DB connection) |
| GET | /api/config | Get business configuration |
| POST | /api/bills | Create a new bill |
| GET | /api/bills | List all bills |
| GET | /api/bills/:id | Get bill details with items |
| GET | /api/bills/search?q=term | Search bills |

---

# 10. Future Enhancements (V2)

- User authentication
- Multi-user roles
- Inventory management
- Online payments
- WhatsApp integration
- Email invoices
- GST filing
- AWS deployment with Terraform
