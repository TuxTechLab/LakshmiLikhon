# Database Schema

## Overview

LakshmiLikhon uses PostgreSQL 16 with 3 tables and supporting sequences/triggers.

## Entity Relationship Diagram

```
┌──────────────────────┐       ┌──────────────────────┐
│       bills          │       │     bill_items       │
│──────────────────────│       │──────────────────────│
│ id (PK)              │──┐    │ id (PK)              │
│ bill_number (UNIQUE) │  │    │ bill_id (FK)         │
│ customer_name        │  └───▶│ product_name         │
│ customer_phone       │       │ description          │
│ customer_address     │       │ quantity             │
│ bill_date            │       │ unit_price           │
│ subtotal             │       │ total                │
│ discount (%)         │       │ created_at           │
│ total                │       └──────────────────────┘
│ created_at           │
│ updated_at           │       ┌──────────────────────┐
└──────────────────────┘       │    admin_users       │
                               │──────────────────────│
┌──────────────────────┐       │ id (PK)              │
│  bill_number_seq     │       │ username (UNIQUE)    │
│──────────────────────│       │ password_hash        │
│ SEQUENCE             │       │ created_at           │
│ START 1              │       └──────────────────────┘
└──────────────────────┘
```

## Table Definitions

### bills

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | SERIAL | PRIMARY KEY | auto | Bill ID |
| bill_number | VARCHAR(20) | NOT NULL, UNIQUE | auto | BILL-000001 format |
| customer_name | VARCHAR(255) | NOT NULL | - | Customer name |
| customer_phone | VARCHAR(20) | NULLABLE | null | Customer phone |
| customer_address | TEXT | NULLABLE | null | Customer address |
| bill_date | DATE | NOT NULL | CURRENT_DATE | Bill date |
| subtotal | NUMERIC(12,2) | NOT NULL | 0 | Sum of item totals |
| discount | NUMERIC(5,2) | NOT NULL | 0 | Discount percentage (0-100) |
| total | NUMERIC(12,2) | NOT NULL | 0 | Grand total after discount |
| created_at | TIMESTAMP WITH TIME ZONE | - | NOW() | Creation timestamp |
| updated_at | TIMESTAMP WITH TIME ZONE | - | NOW() | Last update timestamp |

### bill_items

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | SERIAL | PRIMARY KEY | auto | Item ID |
| bill_id | INTEGER | NOT NULL, FK → bills(id) ON DELETE CASCADE | - | Parent bill |
| product_name | VARCHAR(255) | NOT NULL | - | Product name |
| description | TEXT | NULLABLE | null | Item description |
| quantity | NUMERIC(10,2) | NOT NULL, CHECK > 0 | - | Quantity |
| unit_price | NUMERIC(12,2) | NOT NULL, CHECK >= 0 | - | Price per unit |
| total | NUMERIC(12,2) | NOT NULL | - | quantity × unit_price |
| created_at | TIMESTAMP WITH TIME ZONE | - | NOW() | Creation timestamp |

### admin_users

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | SERIAL | PRIMARY KEY | auto | User ID |
| username | VARCHAR(50) | UNIQUE, NOT NULL | - | Login username |
| password_hash | VARCHAR(255) | NOT NULL | - | bcrypt hashed password |
| created_at | TIMESTAMP WITH TIME ZONE | - | NOW() | Creation timestamp |

## Indexes

```sql
CREATE INDEX idx_bills_bill_number ON bills(bill_number);
CREATE INDEX idx_bills_customer_name ON bills(customer_name);
CREATE INDEX idx_bills_bill_date ON bills(bill_date);
CREATE INDEX idx_bill_items_bill_id ON bill_items(bill_id);
CREATE INDEX idx_admin_users_username ON admin_users(username);
```

## Sequences

### bill_number_seq

```sql
CREATE SEQUENCE IF NOT EXISTS bill_number_seq START 1;
```

Used by the `generate_bill_number()` trigger to create sequential bill numbers.

## Triggers

### Auto-generate Bill Number

```sql
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

### Auto-update updated_at

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_bills_updated_at
    BEFORE UPDATE ON bills
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## Migration Files

| File | Description |
|------|-------------|
| `001_create_tables.sql` | Creates bills, bill_items tables, indexes, sequence, triggers |
| `002_create_admin_users.sql` | Creates admin_users table, index |

Migrations run automatically on application startup. They are idempotent (safe to run multiple times).

## Data Types

| Type | Usage |
|------|-------|
| SERIAL | Auto-incrementing integer primary keys |
| VARCHAR(n) | Fixed-length strings (phone, bill_number) |
| TEXT | Variable-length strings (address, description) |
| NUMERIC(p,s) | Precise decimal for money (no floating-point) |
| DATE | Bill date (no time component) |
| TIMESTAMP WITH TIME ZONE | Timestamps with timezone |
| BOOLEAN | True/false values |

## Money Calculations

All monetary values use `NUMERIC(12,2)` to avoid floating-point precision errors:

```sql
-- Subtotal: sum of all item totals
subtotal = SUM(quantity × unit_price)

-- Discount: percentage of subtotal
discount_amount = subtotal × discount_percent / 100

-- Total: subtotal minus discount
total = subtotal - discount_amount
```
