# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.13.1

FROM node:${NODE_VERSION}-slim
WORKDIR /app

# Create non-root user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Copy package files
COPY --link package.json ./

# Install dependencies
RUN --mount=type=cache,target=/root/.npm \
    npm install

# Copy source code
COPY --link . .

# Change ownership to appuser
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000

# Use Vite dev server with host binding
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
