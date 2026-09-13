# Low Level Design (LLD)

## 1. Database Schema

### bills Table

```sql
CREATE TABLE bills (
    id              SERIAL PRIMARY KEY,
    bill_number     VARCHAR(20) NOT NULL UNIQUE,
    customer_name   VARCHAR(255) NOT NULL,
    customer_phone  VARCHAR(20),
    customer_address TEXT,
    bill_date       DATE NOT NULL DEFAULT CURRENT_DATE,
    subtotal        NUMERIC(12,2) NOT NULL DEFAULT 0,
    discount        NUMERIC(5,2) NOT NULL DEFAULT 0,  -- percentage
    total           NUMERIC(12,2) NOT NULL DEFAULT 0,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### bill_items Table

```sql
CREATE TABLE bill_items (
    id              SERIAL PRIMARY KEY,
    bill_id         INTEGER NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
    product_name    VARCHAR(255) NOT NULL,
    description     TEXT,
    quantity        NUMERIC(10,2) NOT NULL CHECK (quantity > 0),
    unit_price      NUMERIC(12,2) NOT NULL CHECK (unit_price >= 0),
    total           NUMERIC(12,2) NOT NULL,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### admin_users Table

```sql
CREATE TABLE admin_users (
    id              SERIAL PRIMARY KEY,
    username        VARCHAR(50) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Bill Number Generation

```sql
CREATE SEQUENCE IF NOT EXISTS bill_number_seq START 1;

CREATE OR REPLACE FUNCTION generate_bill_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.bill_number IS NULL OR NEW.bill_number = '' THEN
        NEW.bill_number := 'BILL-' || LPAD(NEXTVAL('bill_number_seq')::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_bill_number
    BEFORE INSERT ON bills
    FOR EACH ROW
    EXECUTE FUNCTION generate_bill_number();
```

## 2. API Endpoints

### Authentication

| Method | Path | Auth | Body | Response |
|--------|------|------|------|----------|
| POST | `/api/auth/login` | No | `{ username, password }` | `{ user: { id, username } }` + Set-Cookie |
| POST | `/api/auth/logout` | Yes | - | `{ message }` + Clear-Cookie |
| GET | `/api/auth/me` | Yes | - | `{ user: { id, username } }` |

### Bills

| Method | Path | Auth | Body/Query | Response |
|--------|------|------|------------|----------|
| POST | `/api/bills` | Yes | Bill object | Created bill |
| GET | `/api/bills` | Yes | `?search&limit&offset` | Bill list |
| GET | `/api/bills/:id` | Yes | - | Bill with items |
| GET | `/api/bills/search` | Yes | `?q=term` | Bill list |

### Public

| Method | Path | Auth | Response |
|--------|------|------|----------|
| GET | `/api/health` | No | `{ status, database }` |
| GET | `/api/config` | No | `{ business: {...} }` |

## 3. Backend Module Structure

```
src/
├── server.js              # Entry point, middleware setup, startup
├── config/
│   └── index.js           # Environment variable loader
├── db/
│   ├── pool.js            # PostgreSQL connection pool
│   ├── migrate.js         # Migration runner
│   └── seed.js            # Admin user seeder
├── routes/
│   ├── index.js           # Bill routes (protected)
│   └── auth.js            # Auth routes (public + protected)
├── controllers/
│   ├── billController.js  # Bill request handlers
│   └── authController.js  # Auth request handlers
├── services/
│   ├── billService.js     # Bill business logic
│   └── authService.js     # Auth business logic
├── repositories/
│   ├── billRepository.js  # Bill database queries
│   └── adminRepository.js # Admin database queries
├── middleware/
│   ├── auth.js            # JWT verification
│   └── errorHandler.js    # Centralized error handling
└── utils/
    ├── helpers.js         # formatNumber, calculateTotals
    └── jwt.js             # Token generation/verification
```

## 4. Frontend Module Structure

```
frontend/
├── app/
│   ├── layout.tsx         # Root layout (Providers, Navbar)
│   ├── page.tsx           # Dashboard
│   ├── globals.css        # Tailwind + custom CSS
│   ├── login/page.tsx     # Admin login
│   ├── admin/page.tsx     # Admin panel
│   └── bills/
│       ├── page.tsx       # Bill history
│       ├── new/page.tsx   # Create bill
│       └── [id]/page.tsx  # View bill
├── components/
│   ├── Providers.tsx      # Theme + Auth + Toast providers
│   ├── Navbar.tsx         # Navigation with auth state
│   ├── BillCard.tsx       # Bill list item
│   ├── StatsCard.tsx      # Dashboard stats
│   ├── LoadingSkeleton.tsx # Loading placeholder
│   └── Toast.tsx          # Notification system
└── lib/
    ├── api.ts             # API client (fetch wrapper)
    ├── auth.tsx           # Auth context + useAuth hook
    └── theme.tsx          # Theme context + useTheme hook
```

## 5. Key Algorithms

### Bill Total Calculation

```
function calculateTotals(items, discountPercent):
    subtotal = sum(item.quantity × item.unit_price for each item)
    discount_amount = subtotal × discountPercent / 100
    total = max(0, subtotal - discount_amount)
    return { subtotal, discount_amount, total }
```

### Bill Number Generation (PostgreSQL)

```
Trigger: BEFORE INSERT on bills
    if bill_number is null:
        next_val = nextval('bill_number_seq')
        bill_number = 'BILL-' + LPAD(next_val, 6, '0')
```

### JWT Authentication Flow

```
1. Client sends POST /api/auth/login with credentials
2. Server verifies password with bcrypt.compare()
3. Server generates JWT with { id, username } payload
4. Server sets httpOnly cookie with token
5. Client sends cookie on subsequent requests
6. Auth middleware verifies JWT and attaches user to req
7. Protected route handler accesses req.user
```

## 6. Error Handling

### API Error Response Format

```json
{
  "error": "Human-readable error message"
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (no token / invalid token) |
| 404 | Not Found |
| 500 | Internal Server Error |
| 503 | Service Unavailable (DB disconnected) |
