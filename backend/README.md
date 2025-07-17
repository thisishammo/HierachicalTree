# Awesome Component Maker Backend

## Overview
This is the backend for the Awesome Component Maker, built with Elixir, Phoenix, and PostgreSQL. It provides a secure API for managing employees and generates identicon profile images.

## Features
- Employee CRUD API
- Identicon profile image generation (like GitHub)
- Rate limiting, CORS, and secure headers
- Uses environment variables for all secrets and sensitive config
- Health check endpoint at `/api/health`

## Requirements
- Elixir >= 1.14
- Erlang/OTP >= 25
- PostgreSQL >= 13

## Environment Variables
Set these variables in your environment (e.g., in a `.env` file that is NOT committed to git):

```
SECRET_KEY_BASE=your_secret_key_base
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_HOSTNAME=localhost
DB_NAME=awesome_backend_dev
POOL_SIZE=10
PHX_HOST=localhost
PORT=4000
```

### Loading Environment Variables

By default, environment variables are **not loaded automatically** from a `.env` file. You must set them in your shell before running backend commands, or use a tool to load them.

**Option 1: Manually set in your shell (Windows PowerShell example):**
```powershell
$env:SECRET_KEY_BASE="your_secret"
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="postgres"
$env:DB_HOSTNAME="localhost"
$env:DB_NAME="awesome_backend_dev"
$env:POOL_SIZE="10"
$env:PHX_HOST="localhost"
$env:PORT="4000"
mix phx.server
```

**Option 2: Use a tool to load from `.env` (recommended for development):**
- Install [direnv](https://direnv.net/) or [dotenv-cli](https://www.npmjs.com/package/dotenv-cli).
- Create a `.env` file in `backend/` with your variables.
- Use the tool to load them automatically when you enter the directory or run commands.

## Setup
1. Install dependencies:
   ```
   mix deps.get
   ```
2. Create and migrate the database:
   ```
   mix ecto.create
   mix ecto.migrate
   ```
3. Run the server:
   ```
   mix phx.server
   ```

## Endpoints
- `GET /api/employees` - List employees
- `POST /api/employees` - Create employee
- `GET /api/employees/:id` - Get employee
- `GET /api/identicon/:id` - Get identicon PNG for employee (by email or name)
- `GET /api/health` - Health check

## Security
- All secrets and credentials are loaded from environment variables
- CORS is restricted to the frontend origin
- Secure HTTP headers are set (CSP, XSS, etc.)
- Rate limiting is enabled
- All input is validated and sanitized

## Testing
Run tests with:
```
mix test
```

## Production
- Set all environment variables in your deployment environment
- Use SSL and set `force_ssl` in production config
- Monitor logs and health endpoint

---
