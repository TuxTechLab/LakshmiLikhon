# Deployment Guide

## Prerequisites

- Docker Engine 20.10+
- Docker Compose v2+
- Git

## Quick Start

```bash
git clone <repo-url>
cd LakshmiLikhon
cp .env.example .env
# Edit .env with your settings
./manage.sh start
```

Access:
- Frontend: http://localhost:3001
- API: http://localhost:3000/api/health

## Environment Configuration

### Required Variables

```bash
# Database
DB_PASSWORD=your_secure_password

# Authentication
JWT_SECRET=your_jwt_secret_at_least_32_chars
ADMIN_PASSWORD=your_admin_password

# Business Info
BUSINESS_NAME=Your Business Name
BUSINESS_ADDRESS=Your Address
BUSINESS_PHONE=+91XXXXXXXXXX
BUSINESS_EMAIL=your@email.com
BUSINESS_GSTIN=your_gstin
```

### Optional Variables

```bash
# Ports
FRONTEND_PORT=3001
API_PORT=3000

# Environment
NODE_ENV=development
```

## Docker Commands

### Start Services

```bash
./manage.sh start
```

### Stop Services

```bash
./manage.sh stop
```

### Restart Services

```bash
./manage.sh restart
```

### View Status

```bash
./manage.sh status
```

### View Logs

```bash
./manage.sh logs              # All services
docker compose logs -f api    # API only
docker compose logs -f frontend # Frontend only
```

### Rebuild Images

```bash
./manage.sh build
```

### Fresh Start (Deletes Data)

```bash
./manage.sh fresh
```

## Production Deployment

### 1. Server Setup

```bash
# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo apt install docker-compose-plugin
```

### 2. Clone and Configure

```bash
git clone <repo-url>
cd LakshmiLikhon
cp .env.example .env
nano .env  # Configure for production
```

### 3. Production .env Settings

```bash
NODE_ENV=production
DB_PASSWORD=strong_random_password
JWT_SECRET=long_random_string_at_least_32_chars
ADMIN_PASSWORD=strong_admin_password
FRONTEND_PORT=80
API_PORT=3000
```

### 4. Start in Production

```bash
./manage.sh build
./manage.sh start
```

### 5. SSL/TLS (Recommended)

Use a reverse proxy (nginx) with Let's Encrypt:

```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## AWS EC2 Deployment

### 1. Launch EC2 Instance

- AMI: Ubuntu 22.04 LTS
- Instance Type: t3.small (minimum)
- Security Group: Allow ports 22, 80, 443

### 2. Connect and Setup

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Docker
sudo apt update
sudo apt install -y docker.io docker-compose-plugin
sudo usermod -aG docker ubuntu
newgrp docker
```

### 3. Deploy Application

```bash
git clone <repo-url>
cd LakshmiLikhon
cp .env.example .env
nano .env  # Configure

./manage.sh build
./manage.sh start
```

### 4. Configure Firewall

```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

## Data Persistence

PostgreSQL data is stored in Docker volume `pgdata`:

```bash
# Check volume
docker volume ls | grep pgdata

# Backup
docker compose exec db pg_dump -U billing_user billing > backup.sql

# Restore
docker compose exec -T db psql -U billing_user billing < backup.sql
```

## Monitoring

### Health Check

```bash
curl http://localhost:3000/api/health
# {"status":"ok","database":"connected"}
```

### Container Status

```bash
docker compose ps
# Should show all 3 services as "healthy"
```

### Logs

```bash
# Real-time logs
docker compose logs -f

# Last 100 lines
docker compose logs --tail=100
```

## Troubleshooting

### Container Won't Start

```bash
docker compose logs <service-name>
```

### Database Connection Issues

```bash
# Check DB is running
docker compose ps db

# Test connection
docker compose exec db pg_isready -U billing_user -d billing
```

### Port Already in Use

```bash
# Find process using port
lsof -i :3000

# Change port in .env
API_PORT=3001
```

### Reset Everything

```bash
./manage.sh fresh
```
