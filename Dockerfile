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

# Install backend dependencies
WORKDIR /app/backend
RUN mix deps.get --only prod && \
    mix deps.compile

# Install frontend dependencies
WORKDIR /app
RUN npm ci --legacy-peer-deps || npm install

# Copy project files
COPY . .

# Build frontend assets
RUN npm run build

# Compile backend for production
WORKDIR /app/backend
ENV MIX_ENV=prod
RUN mix compile

# Create non-root user for security
RUN addgroup -g 1000 appuser && \
    adduser -D -u 1000 -G appuser appuser

# Copy startup script and make it executable (before user change)
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Change ownership of app directory
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Set working directory
WORKDIR /app

# Expose the port Phoenix runs on
EXPOSE 4000

# Set environment to production
ENV MIX_ENV=prod
ENV PHX_SERVER=true

# Set entrypoint to start script
ENTRYPOINT ["/app/start.sh"]

