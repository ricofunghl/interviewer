from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql://user:password@postgres:5432/interviewer"
    
    # Redis
    redis_url: str = "redis://redis:6379"
    
    # OpenAI
    openai_api_key: str
    
    # JWT
    jwt_secret: str = "your-secret-key"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 30
    
    # App
    app_name: str = "AI Mock Interview API"
    debug: bool = False
    
    # CORS
    allowed_origins: list = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    class Config:
        env_file = ".env"


settings = Settings() 