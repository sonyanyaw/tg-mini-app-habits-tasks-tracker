from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str 
    ALGORITHM: str = "HS256"
    TELEGRAM_BOT_TOKEN: str 
    REDIS_URL: str 

    ALLOWED_ORIGINS: str

    model_config = {"env_file": ".env"}

    @property
    def allowed_origins(self):
        """Parse the comma-separated ALLOWED_ORIGINS into a list of origins, stripping whitespace"""
        return [
            origin.strip() 
            for origin in self.ALLOWED_ORIGINS.split(",") 
            if origin.strip()
        ]

settings = Settings()