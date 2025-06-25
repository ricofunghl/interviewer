# syntax=docker/dockerfile:1

FROM python:3.11-slim AS base

# Set working directory
WORKDIR /app

# Install system dependencies needed for build and runtime
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Builder stage: install dependencies in a venv
FROM base AS builder

# Copy only requirements.txt first for better caching
COPY --link requirements.txt ./

# Create virtual environment and install dependencies
RUN python -m venv .venv \
    && .venv/bin/pip install --upgrade pip \
    && .venv/bin/pip install -r requirements.txt

# Copy application code (excluding .env, .git, etc. via .dockerignore)
COPY --link app/ ./app/

# Final stage: minimal runtime image
FROM base AS final

# Create a non-root user
RUN useradd -m appuser

# Install uvicorn globally so it is always in PATH
RUN pip install --no-cache-dir uvicorn

# Copy virtual environment from builder
COPY --from=builder /app/.venv /app/.venv

# Copy application code from builder
COPY --from=builder /app/app /app/app

# Set environment so venv is used
ENV PATH="/app/.venv/bin:$PATH"

# Switch to non-root user
USER appuser

# Expose FastAPI port
EXPOSE 8000

# Entrypoint
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
