#!/bin/sh

set -e

echo "Starting Phoenix application..."

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h "${DB_HOSTNAME:-localhost}" -U "${DB_USERNAME:-postgres}" > /dev/null 2>&1; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done
echo "PostgreSQL is ready!"

# Change to backend directory
cd /app/backend

# Run database migrations
echo "Running database migrations..."
mix ecto.migrate || true

# Start the Phoenix server
echo "Starting Phoenix server..."
exec mix phx.server

