# AGENT.md

## Project: LakshmiLikhon - Local Business Bill Generator

You are an autonomous software engineering agent responsible for designing, implementing,
testing, debugging, documenting, containerizing, and preparing deployment of a small
business bill/invoice generation application with an admin panel.

The application must be simple, reliable, maintainable, and suitable for running:

1. Locally on a laptop using Docker Compose.
2. On an AWS EC2 instance using Docker Compose.
3. Later through Terraform-managed AWS infrastructure.

Do not over-engineer the application.

### Subagent Delegation

When using subagents (Task tool), follow these rules:

| Task Type | Subagent | Purpose |
|-----------|----------|---------|
| Code exploration, file discovery | `explore` | Quick searches, pattern matching, reading files |
| Writing code, creating files | `general` | Implementation tasks |
| Running tests, verifying builds | `general` | Execute commands, check outputs |
| Code review, security audit | `explore` | Analyze code for issues |

Always verify subagent output before committing changes.

---

# 1. Primary Objective

Build a web-based bill/invoice generator for a local business.

The application should allow the business owner to:

- Create a new bill.
- Automatically generate the next bill number.
- Add customer information.
- Add multiple clothing/product items.
- Specify quantity.
- Specify unit price.
- Calculate item totals.
- Calculate subtotal.
- Apply optional discount.
- Calculate final total.
- Save the bill.
- View previously generated bills.
- Search bills.
- View bill details.
- Print a bill.
- Generate a print-friendly invoice.
- Track the latest bill number using PostgreSQL.
- Use a clean light/dark theme.
- Run completely inside Docker.

The application should prioritize ease of use over unnecessary features.

---

# 2. Technology Stack

## Frontend

- **Next.js 14** (App Router, React 18)
- **TypeScript** (type safety)
- **Tailwind CSS** (utility-first styling)
- **Framer Motion** (animations)
- Google Fonts (Inter)

## Backend

- Node.js
- Express.js
- JavaScript (CommonJS for backend)

## Authentication

- **jsonwebtoken** (JWT token generation/verification)
- **bcryptjs** (password hashing)
- httpOnly cookies (secure token storage)

## Database

- PostgreSQL

PostgreSQL must run in its own Docker container.

The Express.js application must connect to PostgreSQL over the Docker Compose network.

Do not embed the database inside any application container.

## Containerization

- Docker
- Docker Compose

There must be at least:

1. `frontend` container (Next.js)
2. `api` container (Express.js)
3. `db` container (PostgreSQL)

The PostgreSQL database must use a persistent Docker volume.

---

# 3. Architecture

Expected architecture:

```
Browser
   |
   v
Next.js Frontend (React + Tailwind + Framer Motion)
   |  Port 3001 (internal)
   v
Express.js API (JWT Auth + CRUD)
   |  Port 3000 (internal)
   v
PostgreSQL Database
   |
   v
Docker Persistent Volume
```

Docker Compose manages:

- Frontend container (Next.js)
- API container (Express.js)
- PostgreSQL container
- Internal network
- Database volume
- Environment variables

---

# 4. Configuration

All configuration must come from environment variables wherever practical.

Use a `.env` file for local configuration.

Never hard-code:

- Database passwords
- Database usernames
- Database names
- Application secrets (JWT_SECRET)
- Admin passwords
- Ports
- Database host
- Database port
- Environment-specific configuration

Example environment variables:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
API_PORT=3000
FRONTEND_PORT=3001

DB_HOST=db
DB_PORT=5432
DB_NAME=billing
DB_USER=billing_user
DB_PASSWORD=change_me

NODE_ENV=development

JWT_SECRET=change_me_too
ADMIN_PASSWORD=admin123
```

The actual `.env` file must NOT be committed to Git.

Create:

`.env.example`

containing safe placeholder values.

---

# 5. Docker Requirements

Create production-oriented Dockerfiles for both the Next.js frontend and Express.js API.

## Frontend Dockerfile (frontend/Dockerfile)

- Use Node.js 20 Alpine base image
- Install dependencies
- Build Next.js application
- Run as non-root user
- Expose port 3001

## API Dockerfile (Dockerfile in root)

- Use Node.js 20 Alpine base image
- Install only production dependencies
- Run as non-root user
- Expose port 3000
- Start the Express.js server

## Docker Compose

Must:

- Build both application images
- Start PostgreSQL
- Start Express.js API
- Start Next.js Frontend
- Connect all services through an internal network
- Persist PostgreSQL data
- Load configuration from `.env`
- Allow host ports to be configured through `.env`

Example:

```
API_PORT=3000
FRONTEND_PORT=3001
```

Docker Compose should map:

- `${API_PORT}:3000` for Express
- `${FRONTEND_PORT}:3001` for Next.js

Do not hard-code host ports.

The PostgreSQL port should not need to be exposed to the host by default.

---

# 6. Database Design

Use PostgreSQL.

The database must contain appropriate tables for:

## Bills

Suggested fields:

- id
- bill_number
- customer_name
- customer_phone
- customer_address
- bill_date
- subtotal
- discount
- total
- created_at
- updated_at

## Bill Items

Suggested fields:

- id
- bill_id
- product_name
- description
- quantity
- unit_price
- total

## Admin Users

Suggested fields:

- id
- username (unique)
- password_hash (bcrypt hashed)
- created_at

Use appropriate PostgreSQL data types.

Money calculations must not rely on floating-point arithmetic where avoidable.

Use NUMERIC/DECIMAL for monetary values.

Password hashing must use bcrypt with appropriate salt rounds.

---

# 7. Bill Number Generation

Bill numbers must be sequential.

Example:

BILL-000001
BILL-000002
BILL-000003

The database must be the source of truth.

Do NOT generate bill numbers only in frontend JavaScript.

The backend must safely determine the next bill number.

Concurrent requests must not create duplicate bill numbers.

Prefer PostgreSQL sequences or another transaction-safe mechanism.

The implementation must make sure that restarting:

- Docker
- Node.js
- EC2

does not reset the bill number.

---

# 8. Bill Creation Workflow

Expected workflow:

1. User opens the application.
2. User selects "Create Bill".
3. Customer details are entered.
4. User adds one or more products.
5. Quantity and unit price are entered.
6. Item totals are calculated.
7. Subtotal is calculated.
8. Optional discount is applied.
9. Final total is calculated.
10. User reviews the bill.
11. User saves the bill.
12. Backend validates the request.
13. Backend creates the bill and bill items inside a database transaction.
14. Bill number is generated safely.
15. Saved bill is returned to the frontend.
16. User can view or print the bill.

---

# 9. Validation

Validation must exist on both:

## Frontend

Provide immediate user feedback.

Examples:

- Required customer/product fields.
- Quantity must be positive.
- Price cannot be negative.
- Discount cannot be negative.
- Invalid phone numbers should be rejected where appropriate.

## Backend

Never trust frontend validation.

Validate all incoming data again on the server.

Prevent:

- Invalid quantities
- Negative prices
- Invalid discounts
- Missing required data
- SQL injection
- Malformed requests

---

# 10. Security Requirements

Implement production security.

Use:

- Parameterized SQL queries.
- Environment variables for secrets.
- Secure HTTP headers (helmet for Express).
- Request validation.
- Proper error handling.
- JWT tokens in httpOnly cookies (not localStorage).
- bcrypt password hashing (minimum 10 salt rounds).
- CORS configuration for frontend origin.
- Rate limiting on auth endpoints.

Do not expose:

- Database passwords
- Internal database connection strings
- Stack traces
- Sensitive environment variables
- JWT secrets

to the browser.

Never commit `.env`.

Create `.gitignore` with:

```
.env
node_modules/
.next/
coverage/
*.log
```

---

# 11. API Design

Use a clean REST-style API.

## Public Endpoints

```
GET /api/health
GET /api/config
POST /api/auth/login
```

## Protected Endpoints (JWT Required)

```
POST /api/auth/logout
GET /api/auth/me
POST /api/bills
GET /api/bills
GET /api/bills/:id
GET /api/bills/search
```

## Potential Future Endpoints

```
DELETE /api/bills/:id
PUT /api/bills/:id
POST /api/auth/register
GET /api/admin/users
```

Do not implement unnecessary endpoints until required.

The health endpoint should verify application availability and preferably database connectivity.

Authentication must use JWT tokens stored in httpOnly cookies for security.

The auth middleware must verify the JWT token on protected routes and reject unauthorized requests.

---

# 12. Frontend Requirements

The UI should be clean, modern, and professional.

This is a home-business application, not a complex enterprise dashboard.

## Tech Stack

- **Next.js 14** (App Router for file-based routing)
- **React 18** (component-based UI)
- **Tailwind CSS** (utility-first styling, responsive design)
- **Framer Motion** (animations and transitions)

## Required Pages (Next.js App Router)

### Dashboard (`/`)
- Create Bill button with hover animation
- Latest bill number
- Recent bills list with staggered animation
- Basic total/revenue information

### Create Bill (`/bills/new`)
- Customer form (name, phone, address)
- Dynamic item list (add/remove with animation)
- Item total calculation
- Subtotal, discount, grand total
- Save Bill with loading state

### Bill History (`/bills`)
- Search bar (bill number, customer name, phone)
- Bill list with card layout
- Pagination or infinite scroll

### Bill View (`/bills/[id]`)
- Business information header
- Bill metadata
- Customer section
- Itemized table
- Subtotal/discount/total summary
- Print button

### Admin Login (`/login`)
- Username/password form
- Form validation with error messages
- Loading state during authentication
- Redirect to dashboard on success

### Admin Panel (`/admin`)
- Protected route (redirect to /login if not authenticated)
- Bill management
- Future: settings, user management

## Component Architecture

Create reusable components in `frontend/components/`:

- `Navbar.tsx` - Navigation with auth state
- `BillCard.tsx` - Bill preview card
- `BillForm.tsx` - Bill creation form
- `ItemRow.tsx` - Individual item in form
- `Toast.tsx` - Notification system
- `ThemeToggle.tsx` - Dark/light mode toggle
- `CurrencyToggle.tsx` - Currency selector
- `LoadingSkeleton.tsx` - Loading placeholder
- `ProtectedRoute.tsx` - Auth wrapper

## Animations (Framer Motion)

Implement these animation patterns:

- **Page transitions**: Fade + slide using AnimatePresence
- **Card hover**: Scale 1.02 + shadow increase
- **Button press**: Scale 0.98 on click
- **List items**: Staggered fade-in on mount
- **Form fields**: Focus ring animation
- **Toast**: Slide in from top-right, auto-dismiss
- **Loading**: Skeleton pulse animation
- **Modal**: Backdrop blur + scale up

Always respect `prefers-reduced-motion` for accessibility.

---

# 13. UI / UX

The UI must support:

- Light mode.
- Dark mode.

Provide a visible theme toggle.

Do NOT use neon colors.

Avoid:

- Neon green.
- Neon blue.
- Excessive gradients.
- Excessive animations.
- Glowing UI elements.

Use a professional neutral palette.

The UI should be:

- Clean
- Minimal
- Readable
- Responsive (Tailwind breakpoints: sm, md, lg, xl)
- Mobile-friendly
- Desktop-friendly

The application should work well on a normal laptop and phone browser.

## Tailwind CSS

Use Tailwind CSS for all styling:

- Utility classes for rapid development
- Custom theme configuration in `tailwind.config.ts`
- Dark mode via `class` strategy
- Responsive design with mobile-first approach
- Consistent spacing, colors, and typography

## Theme Configuration

Configure custom colors in `tailwind.config.ts`:

```typescript
// tailwind.config.ts
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { ... },
        surface: { ... },
        // ...
      },
    },
  },
}
```

Persist the user's theme preference in localStorage.

---

# 14. Printing

Printing is an important feature.

Create a print-specific CSS layout.

The printed bill should:

- Hide navigation.
- Hide buttons.
- Hide unnecessary UI.
- Have clean spacing.
- Be suitable for A4 paper.
- Be readable in black and white.
- Preserve the important billing information.

Use browser print functionality initially.

Do not introduce PDF-generation libraries unless there is a clear requirement.

---

# 15. Business Information

Do not hard-code personal business information throughout the application.

Business details should eventually be configurable.

For the first version, support environment variables or a central configuration file for:

- Business name
- Business address
- Phone number
- Email
- GST/tax information if required later

Do not assume GST is required unless explicitly configured.

---

# 16. Error Handling

Create centralized error handling.

API errors should return structured JSON.

Example:

{
  "error": "Human readable message"
}

Do not expose stack traces in production.

Log useful server-side errors.

---

# 17. Database Initialization

The application must provide a reliable database initialization/migration mechanism.

Do not require manually entering SQL commands every time the project starts.

Prefer a migration system or a clear initialization script.

Database initialization must be safe to run repeatedly.

Do not destroy existing production data when the application restarts.

---

# 18. Project Structure

Use this structure:

```
LakshmiLikhon/
├── frontend/                  # Next.js application
│   ├── app/                   # App Router pages
│   │   ├── layout.tsx         # Root layout with providers
│   │   ├── page.tsx           # Dashboard
│   │   ├── globals.css        # Global styles + Tailwind
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
│   ├── tsconfig.json          # TypeScript configuration
│   ├── package.json
│   └── Dockerfile
│
├── src/                       # Express.js API
│   ├── server.js
│   ├── config/
│   ├── db/
│   │   ├── pool.js
│   │   └── migrate.js
│   ├── routes/
│   │   ├── index.js
│   │   └── auth.js            # Auth routes
│   ├── controllers/
│   │   ├── billController.js
│   │   └── authController.js  # Auth controller
│   ├── services/
│   │   ├── billService.js
│   │   └── authService.js     # Auth service
│   ├── repositories/
│   │   ├── billRepository.js
│   │   └── adminRepository.js # Admin user queries
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── auth.js            # JWT auth middleware
│   └── utils/
│       ├── helpers.js
│       └── jwt.js             # JWT utilities
│
├── migrations/
│   ├── 001_create_tables.sql
│   └── 002_create_admin_users.sql
│
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

Adjust the structure if there is a strong technical reason, but maintain separation of concerns.

---

# 19. Testing

Testing is mandatory.

At minimum provide:

## Backend tests

Test:

- Health endpoint.
- Bill creation.
- Bill number generation.
- Multiple bill creation.
- Bill retrieval.
- Search.
- Validation failures.
- Database failures.

## Business logic tests

Test:

- Item total.
- Subtotal.
- Discount.
- Grand total.
- Multiple items.
- Edge cases.

## Container testing

Verify:

docker compose build

docker compose up

docker compose ps

Application accessibility.

Database connectivity.

Bill persistence after container restart.

---

# 20. Data Persistence Test

This is critical.

The agent must verify:

1. Start containers.
2. Create a bill.
3. Stop containers.
4. Start containers again.
5. Verify the bill still exists.
6. Create another bill.
7. Verify the bill number continues sequentially.

Never mark the project complete without testing persistence.

---

# 21. Terraform

Terraform is a later phase.

Do not start with AWS infrastructure.

First make the application fully functional locally using Docker Compose.

Later create:

terraform/

with infrastructure for:

- AWS VPC.
- Public/private networking as appropriate.
- EC2.
- Security groups.
- IAM role.
- EBS storage where appropriate.
- Elastic IP if required.
- Docker installation/bootstrap.
- Application deployment.

Do not put database credentials directly into Terraform files.

Terraform should consume variables/secrets securely.

The initial Terraform implementation should target a simple single-EC2 deployment.

A managed database such as RDS can be considered later.

---

# 22. AWS Deployment

The first AWS deployment target is:

```
AWS EC2
   |
   Docker Compose
      |
      +-- Next.js Frontend container
      |
      +-- Express.js API container
      |
      +-- PostgreSQL container
      |
      +-- Persistent Docker volume
```

Do not introduce Kubernetes for the initial deployment.

Keep the AWS deployment simple.

---

# 23. Documentation

README.md must explain:

- Project purpose.
- Architecture.
- Prerequisites.
- Environment variables.
- Local setup.
- Docker setup.
- Database setup.
- Running tests.
- Creating a bill.
- Printing a bill.
- Troubleshooting.
- AWS deployment.
- Terraform usage when implemented.

Include useful commands.

---

# 24. Git Practices

Use meaningful commits.

Suggested milestones:

feat: initialize bill generator
feat: add database schema
feat: add bill creation API
feat: add bill creation UI
feat: add bill history
feat: add printing
feat: add dark mode
test: add application tests
build: add docker compose
docs: add deployment documentation
infra: add terraform

Do not commit:

.env
credentials
private keys
database dumps
node_modules

---

# 25. Development Rules

Before implementing a feature:

1. Understand the existing architecture.
2. Check plan.md.
3. Check loop.md.
4. Inspect existing implementation.
5. Make the smallest appropriate change.
6. Test the change.
7. Fix failures.
8. Update documentation if needed.

Do not rewrite working components unnecessarily.

Do not introduce dependencies without justification.

Prefer simple solutions.

---

# 26. Definition of Done

A feature is complete only when:

- Implementation works.
- Validation exists.
- Errors are handled.
- Tests pass.
- Docker works.
- Existing functionality is not broken.
- Documentation is updated where necessary.

The complete project is done only when:

- `docker compose up` starts all 3 services (frontend, api, db).
- Next.js frontend accessible on port 3001.
- Express.js API accessible on port 3000.
- PostgreSQL runs separately.
- Admin can login with JWT authentication.
- Protected routes reject unauthorized requests.
- Bills can be created.
- Bills persist.
- Bill numbers are sequential.
- Bill history works.
- Search works.
- Bill printing works.
- Light/dark mode works.
- Animations are smooth (Framer Motion).
- Tailwind CSS styles are consistent.
- Tests pass.
- `.env` configuration works.
- No secrets are committed.
- README is complete.
- Terraform groundwork is documented.

---

# 27. Agent Behavior

When working autonomously:

```
PLAN
→ IMPLEMENT
→ TEST
→ INSPECT
→ DEBUG
→ RE-TEST
→ DOCUMENT
→ COMMIT-READY
```

Do not stop after writing code.

Always execute tests and validate the actual application.

If a test fails:

1. Identify root cause.
2. Fix it.
3. Run the relevant test again.
4. Run the complete test suite.
5. Continue only when stable.

Never hide errors just to make tests pass.

Never remove a test merely because implementation fails.

### Subagent Usage

Use the Task tool to delegate work to subagents:

- **explore** agent: For code exploration, file discovery, reading existing code, pattern matching
- **general** agent: For writing code, creating files, running commands, multi-step implementation

When delegating:

1. Provide clear, detailed instructions
2. Specify exact files to read/modify
3. Ask for specific output (file paths, test results, etc.)
4. Verify the output before marking tasks complete

Example delegation patterns:

```
# Explore existing code
Task(subagent_type="explore", prompt="Find all API routes in src/routes/")

# Implement a feature
Task(subagent_type="general", prompt="Create the auth middleware in src/middleware/auth.js")
```

---

# 28. Priority

Priority order:

1. Correctness
2. Data integrity
3. Security (including JWT auth)
4. Simplicity
5. Maintainability
6. User experience (animations, responsive design)
7. Performance
8. Infrastructure automation

The bill and financial data must always be treated as important business data.

Admin authentication must be secure (httpOnly cookies, bcrypt, JWT).
