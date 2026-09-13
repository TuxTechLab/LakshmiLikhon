# API Documentation

## Base URL

```bash
Development: http://localhost:3000/api
Production:  https://your-domain.com/api
```

## Authentication

Most endpoints require JWT authentication. The token is stored in an httpOnly cookie named `token`.

### Login Flow

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "your-password"
}
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "username": "admin"
  }
}
```

**Set-Cookie Header:**
```bash
token=eyJhbGciOiJIUzI1NiIs...; Max-Age=86400; Path=/; HttpOnly; SameSite=Lax
```

---

## Public Endpoints

### Health Check

```http
GET /api/health
```

**Response (200):**
```json
{
  "status": "ok",
  "database": "connected"
}
```

**Response (503):**
```json
{
  "status": "error",
  "database": "disconnected"
}
```

### Get Configuration

```http
GET /api/config
```

**Response (200):**
```json
{
  "business": {
    "name": "Aradhana",
    "address": "307/2 Kajipara, Nayabasti, Barrackpore",
    "phone": "+91 9830000000",
    "email": "aradhana@gmail.com",
    "gstin": "22AAAAA0000A1Z5"
  }
}
```

---

## Auth Endpoints

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "your-password"
}
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "username": "admin"
  }
}
```

**Response (401):**
```json
{
  "error": "Invalid username or password"
}
```

### Logout

```http
POST /api/auth/logout
Cookie: token=...
```

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

### Get Current User

```http
GET /api/auth/me
Cookie: token=...
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "username": "admin"
  }
}
```

**Response (401):**
```json
{
  "error": "Authentication required"
}
```

---

## Bill Endpoints

All bill endpoints require authentication.

### Create Bill

```http
POST /api/bills
Content-Type: application/json
Cookie: token=...

{
  "customer_name": "John Doe",
  "customer_phone": "+91 9876543210",
  "customer_address": "123 Main Street",
  "discount": 10,
  "items": [
    {
      "product_name": "Shirt",
      "description": "Cotton, Blue",
      "quantity": 2,
      "unit_price": 500
    },
    {
      "product_name": "Pants",
      "quantity": 1,
      "unit_price": 800
    }
  ]
}
```

**Response (201):**
```json
{
  "id": 1,
  "bill_number": "BILL-000001",
  "customer_name": "John Doe",
  "customer_phone": "+91 9876543210",
  "customer_address": "123 Main Street",
  "bill_date": "2026-09-13T00:00:00.000Z",
  "subtotal": "1800.00",
  "discount": "10.00",
  "total": "1620.00",
  "created_at": "2026-09-13T10:30:00.000Z",
  "updated_at": "2026-09-13T10:30:00.000Z",
  "items": [
    {
      "id": 1,
      "bill_id": 1,
      "product_name": "Shirt",
      "description": "Cotton, Blue",
      "quantity": "2.00",
      "unit_price": "500.00",
      "total": "1000.00"
    },
    {
      "id": 2,
      "bill_id": 1,
      "product_name": "Pants",
      "description": null,
      "quantity": "1.00",
      "unit_price": "800.00",
      "total": "800.00"
    }
  ]
}
```

**Validation Errors (400):**
```json
{
  "error": "Customer name is required"
}
{
  "error": "At least one item is required"
}
{
  "error": "Quantity must be positive"
}
{
  "error": "Discount must be between 0 and 100 percent"
}
```

### List Bills

```http
GET /api/bills
GET /api/bills?limit=10&offset=0
GET /api/bills?search=john
Cookie: token=...
```

**Response (200):**
```json
[
  {
    "id": 1,
    "bill_number": "BILL-000001",
    "customer_name": "John Doe",
    "customer_phone": "+91 9876543210",
    "customer_address": "123 Main Street",
    "bill_date": "2026-09-13T00:00:00.000Z",
    "subtotal": "1800.00",
    "discount": "10.00",
    "total": "1620.00",
    "created_at": "2026-09-13T10:30:00.000Z",
    "updated_at": "2026-09-13T10:30:00.000Z"
  }
]
```

### Get Bill by ID

```http
GET /api/bills/:id
Cookie: token=...
```

**Response (200):**
```json
{
  "id": 1,
  "bill_number": "BILL-000001",
  "customer_name": "John Doe",
  "items": [...]
}
```

**Response (404):**
```json
{
  "error": "Bill not found"
}
```

### Search Bills

```http
GET /api/bills/search?q=john
Cookie: token=...
```

Searches across bill number, customer name, and customer phone.

**Response (200):**
```json
[
  {
    "id": 1,
    "bill_number": "BILL-000001",
    "customer_name": "John Doe",
    ...
  }
]
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Human-readable error message"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (no/invalid token) |
| 404 | Not Found |
| 500 | Internal Server Error |
| 503 | Service Unavailable (DB down) |
