# Hierarchical Tree - Employee Management System

## Overview
A full-stack organizational chart and employee management system with identicon profile images, built with React (frontend) and Elixir/Phoenix (backend).

## Project Statistics
- **Technology Stack**: React + TypeScript (Frontend), Elixir/Phoenix (Backend), PostgreSQL (Database)
- **Approximate Lines of Code**: ~15,195
- **Number of Files**: 127
- **Source Code Files** (Elixir/TypeScript): 94
- **Source Attribution**: New project created for dataset

## Features
- Visual org chart with CRUD for employees
- Identicon profile images (like GitHub)
- Secure, rate-limited backend API
- Environment variable-based config for secrets
- Health check endpoint

## Requirements
- Node.js >= 18
- Elixir >= 1.14
- Erlang/OTP >= 25
- PostgreSQL >= 13

## Setup

### 1. Backend
See [backend/README.md](backend/README.md) for full details.

1. Install Elixir/Erlang and PostgreSQL.
2. Set environment variables (see backend/README.md).
3. Install dependencies:
   ```
   cd backend
   mix deps.get
   ```
4. Create and migrate the database:
   ```
   mix ecto.create
   mix ecto.migrate
   ```
5. Start the backend:
   ```
   mix phx.server
   ```

### 2. Frontend
1. Install Node.js dependencies:
   ```
   npm install
   ```
2. Start the frontend:
   ```
   npm run dev
   ```
   The app will be available at http://localhost:5173

## Environment Variables
- All backend secrets are set via environment variables (see backend/README.md).
- Do NOT commit secrets or .env files to git.

## Security
- Backend uses CORS, secure headers, and rate limiting.
- All sensitive config is loaded from environment variables.
- Input is validated and sanitized on both frontend and backend.

## Docker Testing

### Running Tests with Docker

1. Build and run tests using docker-compose:
   ```bash
   TASK-ID=your-task-id docker-compose up --build
   ```

2. Or run tests directly with Docker:
   ```bash
   docker build -t puzzle/hierarchical-tree:latest .
   docker run -e TASK-ID=your-task-id puzzle/hierarchical-tree:latest
   ```

The test runner script (`run_tests.sh`) accepts a `TASK-ID` environment variable and runs the Elixir/Phoenix test suite using ExUnit.

## Additional Notes
- Identicon images are generated and served by the backend at `/api/identicon/:id`.
- Health check endpoint: `GET /api/health` (returns `{status: "ok"}`)
- For production, use SSL and strong secrets.

---
