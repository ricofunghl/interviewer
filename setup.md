# AI Mock Interview App - Setup Guide

## Prerequisites

Before setting up the application, ensure you have the following installed:

- **Docker & Docker Compose** (recommended for easy setup)
- **Node.js 18+** (for local frontend development)
- **Python 3.11+** (for local backend development)
- **PostgreSQL** (if running locally without Docker)
- **Redis** (if running locally without Docker)
- **OpenAI API Key** (required for AI functionality)

## Quick Start with Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd interviewer
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env and add your OpenAI API key
   ```

3. **Start the application**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Local Development Setup

### Backend Setup

1. **Create virtual environment**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   ```bash
   cp ../env.example .env
   # Edit .env with your configuration
   ```

4. **Run the backend**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Set up environment variables**
   ```bash
   # Create .env file in frontend directory
   echo "VITE_API_URL=http://localhost:8000" > .env
   ```

3. **Run the frontend**
   ```bash
   npm run dev
   ```

## Database Setup

### With Docker (Automatic)
The database is automatically created when using Docker Compose.

### Manual Setup
1. **Create PostgreSQL database**
   ```sql
   CREATE DATABASE interviewer;
   CREATE USER user WITH PASSWORD 'password';
   GRANT ALL PRIVILEGES ON DATABASE interviewer TO user;
   ```

2. **Run migrations** (if using Alembic)
   ```bash
   cd backend
   alembic upgrade head
   ```

## Environment Variables

### Required Variables
- `OPENAI_API_KEY`: Your OpenAI API key for AI functionality
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string

### Optional Variables
- `JWT_SECRET`: Secret key for JWT tokens (auto-generated if not provided)
- `DEBUG`: Enable debug mode (default: false)
- `ALLOWED_ORIGINS`: CORS allowed origins

## API Endpoints

### Interview Management
- `POST /api/interviews/create` - Create new interview from job description
- `POST /api/interviews/{id}/start` - Start interview session
- `POST /api/interviews/{id}/respond` - Submit response to question
- `GET /api/interviews/{id}/feedback` - Get interview feedback
- `GET /api/interviews/history` - Get user's interview history

### Health Check
- `GET /health` - Application health status

## Features

### Core Functionality
1. **Job Description Upload**: Paste or upload job descriptions
2. **AI Question Generation**: Automatically generates 8 questions (3 behavioral + 5 technical)
3. **Chat-based Interview**: Natural conversation flow with AI interviewer
4. **Real-time Feedback**: Instant scoring and feedback on responses
5. **Interview History**: Track and review past interviews
6. **Detailed Analytics**: Comprehensive performance analysis

### AI Capabilities
- **Question Generation**: Tailored questions based on job description
- **Response Evaluation**: Score responses from 1-10 with detailed feedback
- **Performance Analysis**: Overall interview scoring and recommendations
- **Adaptive Interviewing**: Dynamic question flow based on responses

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL is running
   - Check DATABASE_URL in environment variables
   - Verify database credentials

2. **OpenAI API Errors**
   - Verify OPENAI_API_KEY is set correctly
   - Check API key permissions and quota
   - Ensure internet connectivity

3. **Frontend Not Loading**
   - Check if backend is running on port 8000
   - Verify VITE_API_URL in frontend .env
   - Check browser console for errors

4. **Docker Issues**
   - Ensure Docker and Docker Compose are installed
   - Check if ports 3000, 8000, 5432, 6379 are available
   - Run `docker-compose logs` to check service logs

### Performance Optimization

1. **Database Indexing**
   - Add indexes on frequently queried columns
   - Optimize database queries

2. **Caching**
   - Redis is used for session management
   - Consider caching frequently accessed data

3. **AI Response Time**
   - OpenAI API calls can be slow
   - Consider implementing response caching
   - Use streaming responses for better UX

## Production Deployment

### Security Considerations
1. **Environment Variables**: Never commit sensitive data
2. **API Keys**: Rotate OpenAI API keys regularly
3. **Database**: Use strong passwords and SSL connections
4. **CORS**: Restrict allowed origins in production

### Scaling
1. **Load Balancing**: Use nginx or similar for multiple instances
2. **Database**: Consider read replicas for high traffic
3. **Caching**: Implement Redis clustering for high availability
4. **Monitoring**: Add application monitoring and logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details 