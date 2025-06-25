## Running with Docker

This project is fully containerized for local development using Docker and Docker Compose.

### Requirements
- **Docker** and **Docker Compose** installed on your machine
- No local installations of Node.js or Python required

### Service Versions
- **Backend**: Python 3.11 (see `backend/Dockerfile`)
- **Frontend**: Node.js 22.13.1 (see `frontend/Dockerfile`)
- **Database**: PostgreSQL (latest)
- **Cache**: Redis (latest)

### Environment Variables
- Copy `env.example` to `.env` in the project root:
  ```bash
  cp env.example .env
  # Edit .env with your API keys and secrets
  ```
- Required variables (see `docker-compose.yml` and `.env.example`):
  - `OPENAI_API_KEY` (for AI features)
  - `DATABASE_URL` (PostgreSQL connection string)
  - `REDIS_URL` (Redis connection string)
  - `JWT_SECRET` (for authentication)

### Build & Run
1. **Start all services:**
   ```bash
   docker-compose up --build -d
   ```
   This will build and start the backend, frontend, PostgreSQL, and Redis containers.

2. **Access the application:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8000](http://localhost:8000)
   - API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### Ports
- **Frontend**: `3000` (exposed on host)
- **Backend**: `8000` (exposed on host)
- **PostgreSQL**: `5432` (exposed on host)
- **Redis**: `6379` (exposed on host)

### Notes
- The backend and frontend containers run as non-root users for security.
- Persistent PostgreSQL data is stored in the `pgdata` Docker volume.
- If you need to customize environment variables, edit your `.env` file before starting the containers.
- Health checks are configured for PostgreSQL and Redis to ensure services are ready before the backend starts.

For more details on environment variables and configuration, see the [Environment Variables](#environment-variables) section above.