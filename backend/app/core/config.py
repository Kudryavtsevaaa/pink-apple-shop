# backend/app/core/config.py
from pydantic_settings import BaseSettings
from typing import List, Union
from functools import lru_cache
import os

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres@localhost:5432/apple"
    SECRET_KEY: str = "your-secret-key-change-in-prod"
    DEBUG: bool = True
    # Принимаем как строку или список
    CORS_ORIGINS: Union[str, List[str]] = [
    "http://localhost:3000",
    "https://resonant-mandazi-1a54a2.netlify.app",
    "https://ready-cycles-worry.loca.lt",
    "https://*.netlify.app",  # Для всех поддоменов netlify
    "https://*.loca.lt"       # Для всех поддоменов localtunnel
]
    
    model_config = {
        "env_file": ".env",
        "extra": "ignore"
    }
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Преобразует CORS_ORIGINS в список строк"""
        if isinstance(self.CORS_ORIGINS, list):
            return self.CORS_ORIGINS
        if isinstance(self.CORS_ORIGINS, str):
            # Если JSON-строка
            if self.CORS_ORIGINS.startswith('['):
                import json
                return json.loads(self.CORS_ORIGINS)
            # Если строка через запятую
            return [origin.strip() for origin in self.CORS_ORIGINS.split(',') if origin.strip()]
        return ["*"]

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()