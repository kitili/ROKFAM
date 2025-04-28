import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Flask settings
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here')
    
    # Database settings
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'mysql+pymysql://user:password@localhost/rokfam_db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT settings
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key-here')
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 hour
    
    # Firebase settings
    FIREBASE_CREDENTIALS = os.getenv('FIREBASE_CREDENTIALS_PATH', 'path-to-firebase-credentials.json')
    
    # WebSocket settings
    SOCKETIO_MESSAGE_QUEUE = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
    
    # CORS settings
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(',')
    
class DevelopmentConfig(Config):
    DEBUG = True
    
class ProductionConfig(Config):
    DEBUG = False
    
class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
} 