# AGENT.md

## Project: Home Cloth Business Bill Generator

You are an autonomous software engineering agent responsible for designing, implementing,
testing, debugging, documenting, containerizing, and preparing deployment of a small
business bill/invoice generation application.

The application must be simple, reliable, maintainable, and suitable for running:

1. Locally on a laptop using Docker Compose.
2. On an AWS EC2 instance using Docker Compose.
3. Later through Terraform-managed AWS infrastructure.

Do not over-engineer the application.

---

# 1. Primary Objective

Build a web-based bill/invoice generator for a small home-based cloth business.

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

## Backend

- Node.js
- Express.js
- JavaScript

Do not introduce TypeScript unless explicitly required later.

## Frontend

Use:

- HTML
- CSS
- Vanilla JavaScript

Avoid React, Vue, Angular, or other frontend frameworks unless explicitly requested.

The application should remain lightweight.

## Database

Use:

- PostgreSQL

PostgreSQL must run in its own Docker container.

The Node.js application must connect to PostgreSQL over the Docker Compose network.

Do not embed the database inside the Node.js container.

## Containerization

Use:

- Docker
- Docker Compose

There must be at least:

1. `app` container
2. `db` container

The PostgreSQL database must use a persistent Docker volume.

---

# 3. Architecture

Expected architecture:

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

Docker Compose manages:

- Application container
- PostgreSQL container
- Network
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
- Application secrets
- Ports
- Database host
- Database port
- Environment-specific configuration

Example environment variables:

APP_PORT=3000

DB_HOST=db
DB_PORT=5432
DB_NAME=billing
DB_USER=billing_user
DB_PASSWORD=change_me

NODE_ENV=development

The actual `.env` file must NOT be committed to Git.

Create:

`.env.example`

containing safe placeholder values.

---

# 5. Docker Requirements

Create a production-oriented Dockerfile for the Node.js application.

The Docker image should:

- Use a lightweight Node.js base image.
- Install only required dependencies.
- Run as a non-root user where practical.
- Expose the application port.
- Start the Node.js server using the package start command.

Docker Compose must:

- Build the application image.
- Start PostgreSQL.
- Start the Node.js application.
- Connect both services through an internal network.
- Persist PostgreSQL data.
- Load configuration from `.env`.
- Allow the host application port to be configured through `.env`.

Example:

APP_PORT=3000

Docker Compose should map:

`${APP_PORT}:3000`

Do not hard-code the host port.

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

Use appropriate PostgreSQL data types.

Money calculations must not rely on floating-point arithmetic where avoidable.

Use NUMERIC/DECIMAL for monetary values.

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

Implement basic production security.

Use:

- Parameterized SQL queries.
- Environment variables for secrets.
- Secure HTTP headers where practical.
- Request validation.
- Proper error handling.

Do not expose:

- Database passwords
- Internal database connection strings
- Stack traces
- Sensitive environment variables

to the browser.

Never commit `.env`.

Create `.gitignore` with:

.env
node_modules/
coverage/
*.log

---

# 11. API Design

Use a clean REST-style API.

Suggested endpoints:

GET /api/health

GET /api/bills

GET /api/bills/:id

POST /api/bills

GET /api/bills/search

Potential future endpoints:

DELETE /api/bills/:id

PUT /api/bills/:id

Do not implement unnecessary endpoints until required.

The health endpoint should verify application availability and preferably database connectivity.

---

# 12. Frontend Requirements

The UI should be clean and professional.

This is a home-business application, not a complex enterprise dashboard.

Required screens/components:

## Dashboard

Show:

- Create Bill button.
- Latest bill number.
- Recent bills.
- Basic total/revenue information if easy to implement.

## Create Bill

Include:

Customer:

- Name
- Phone
- Address

Products:

- Product name
- Description
- Quantity
- Unit price
- Item total

Summary:

- Subtotal
- Discount
- Grand Total

Actions:

- Save Bill
- Clear
- Print after saving

## Bill History

Allow:

- List bills.
- Search by bill number.
- Search by customer name.
- Search by phone number.
- View bill.

## Bill View

Display:

- Business information.
- Bill number.
- Date.
- Customer details.
- Products.
- Quantity.
- Unit price.
- Item total.
- Subtotal.
- Discount.
- Grand total.

Provide:

- Print button.

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
- Responsive
- Mobile-friendly
- Desktop-friendly

The application should work well on a normal laptop and phone browser.

Use CSS variables for theme colors.

Example conceptual structure:

:root {
    --background: ...;
    --surface: ...;
    --text: ...;
    --border: ...;
    --primary: ...;
}

[data-theme="dark"] {
    ...
}

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

Use a clean structure similar to:

bill-generator/
│
├── agent.md
├── plan.md
├── loop.md
├── README.md
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .gitignore
├── .env.example
├── package.json
│
├── src/
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
├── public/
│   ├── index.html
│   ├── css/
│   └── js/
│
├── migrations/
│
├── tests/
│
└── terraform/
    └── README.md

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

AWS EC2
   |
   Docker Compose
      |
      +-- Node.js container
      |
      +-- PostgreSQL container
      |
      +-- Persistent Docker volume

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

- `docker compose up` starts the application.
- PostgreSQL runs separately.
- Bills can be created.
- Bills persist.
- Bill numbers are sequential.
- Bill history works.
- Search works.
- Bill printing works.
- Light/dark mode works.
- Tests pass.
- `.env` configuration works.
- No secrets are committed.
- README is complete.
- Terraform groundwork is documented.

---

# 27. Agent Behavior

When working autonomously:

PLAN
→ IMPLEMENT
→ TEST
→ INSPECT
→ DEBUG
→ RE-TEST
→ DOCUMENT
→ COMMIT-READY

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

---

# 28. Priority

Priority order:

1. Correctness
2. Data integrity
3. Simplicity
4. Security
5. Maintainability
6. User experience
7. Performance
8. Infrastructure automation

The bill and financial data must always be treated as important business data.
