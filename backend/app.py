from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO
from flask_cors import CORS
from config.config import config

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
socketio = SocketIO()

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app)
    socketio.init_app(app, message_queue=app.config['SOCKETIO_MESSAGE_QUEUE'])
    
    # Register blueprints
    from routes.auth import auth_bp
    from routes.products import products_bp
    from routes.sales import sales_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(products_bp, url_prefix='/api/products')
    app.register_blueprint(sales_bp, url_prefix='/api/sales')
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    return app

if __name__ == '__main__':
    app = create_app()
    socketio.run(app, debug=True) 