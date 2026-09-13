# LakshmiLikhon

A modern bill/invoice generator for home-based cloth businesses.

**Stack:** Next.js 14 · Express.js · PostgreSQL 16 · Tailwind CSS · Framer Motion · Docker

## Quick Start

```bash
git clone <repo-url> && cd LakshmiLikhon
cp .env.example .env          # edit with your settings
./manage.sh start
```

- **Frontend:** http://localhost:3001
- **Login:** `admin` / your `ADMIN_PASSWORD`

## Commands

| Command | Description |
|---------|-------------|
| `./manage.sh start` | Start all services |
| `./manage.sh stop` | Stop all services |
| `./manage.sh restart` | Restart all services |
| `./manage.sh build` | Rebuild Docker images |
| `./manage.sh fresh` | Full reset (deletes data) |
| `./manage.sh status` | Show container status |
| `./manage.sh logs` | Tail logs |
| `./manage.sh test` | Run tests |

## Features

- Sequential bill numbers (BILL-000001)
- Percentage-based discount
- Print-ready A4 invoices
- Dark/light mode
- Admin authentication (JWT)
- Responsive design
- Animated UI (Framer Motion)

## Documentation

| Document | Description |
|----------|-------------|
| [High Level Design](docs/HLD.md) | System overview, goals, architecture |
| [Low Level Design](docs/LLD.md) | Database schema, API specs, module structure |
| [Architecture](docs/architecture.md) | Network, data, auth, Docker architecture |
| [UI/UX Design](docs/Design.md) | Colors, typography, components, layouts |
| [API Documentation](docs/api.md) | All endpoints with examples |
| [Database Schema](docs/database.md) | Tables, indexes, triggers, migrations |
| [Deployment Guide](docs/deployment.md) | Docker, AWS, SSL, backup/restore |
| [Implementation Plan](plan.md) | Phases, goals, tech stack |
| [Engineering Loop](loop.md) | Development workflow |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, Tailwind CSS, Framer Motion |
| Backend | Express.js, JWT, bcryptjs |
| Database | PostgreSQL 16 |
| Infra | Docker, Docker Compose |

## License

GPL-3.0
