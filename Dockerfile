# Use Elixir base image with Alpine for smaller size
FROM elixir:1.14-alpine AS builder

# Install build dependencies
RUN apk add --no-cache \
    build-base \
    git \
    nodejs \
    npm \
    postgresql-client

# Set working directory
WORKDIR /app

# Install Hex and Rebar
RUN mix local.hex --force && \
    mix local.rebar --force

# Copy dependency files
COPY backend/mix.exs backend/mix.lock ./backend/
COPY package.json package-lock.json* ./

# Install backend dependencies (including test dependencies)
WORKDIR /app/backend
RUN mix deps.get && \
    mix deps.compile

# Install frontend dependencies
WORKDIR /app
RUN npm ci --legacy-peer-deps || npm install

# Copy test runner script and make it executable (before user change)
COPY run_tests.sh /app/run_tests.sh
RUN chmod +x /app/run_tests.sh

# Copy project files
COPY . .

# Compile backend
WORKDIR /app/backend
RUN mix compile

# Create non-root user for security
RUN addgroup -g 1000 appuser && \
    adduser -D -u 1000 -G appuser appuser

# Change ownership of app directory
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Set working directory
WORKDIR /app

# Set entrypoint to test runner
ENTRYPOINT ["/app/run_tests.sh"]

