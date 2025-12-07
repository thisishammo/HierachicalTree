#!/bin/sh

# Test runner script that accepts TASK-ID as parameter
# Usage: ./run_tests.sh [TASK-ID]
# Environment variable: TASK_ID (or passed as first argument)

set -e

# Get TASK_ID from environment variable (TASK_ID) or first argument
# Note: Shell doesn't support dashes in variable names, so we use TASK_ID
TASK_ID="${TASK_ID:-${1}}"

echo "Starting test runner..."
echo "TASK-ID: ${TASK_ID}"

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h "${DB_HOSTNAME:-localhost}" -U "${DB_USERNAME:-postgres}" > /dev/null 2>&1; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done
echo "PostgreSQL is ready!"

# Change to backend directory
cd /app/backend

# Set up test database
echo "Setting up test database..."
mix ecto.create || true
mix ecto.migrate || true

# Run tests
echo "Running tests..."
if [ -n "${TASK_ID}" ]; then
  echo "Running tests for TASK-ID: ${TASK_ID}"
  # If TASK-ID is provided, you can filter tests or run specific test files
  # For now, we'll run all tests but you can customize this based on your needs
  mix test
else
  echo "Running all tests..."
  mix test
fi

EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
  echo "All tests passed!"
else
  echo "Tests failed with exit code: $EXIT_CODE"
fi

exit $EXIT_CODE

