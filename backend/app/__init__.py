from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    basedir = os.path.abspath(os.path.dirname(__file__))
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///productivity_app.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    CORS(app, resources={r"/*": {"origins": "*"}})
    db.init_app(app)

    from .routes.tasks import tasks_bp
    from .routes.rewards import rewards_bp
    from .routes.reflections import reflections_bp
    app.register_blueprint(tasks_bp, url_prefix='/api') 
    app.register_blueprint(rewards_bp, url_prefix='/api') 
    app.register_blueprint(reflections_bp, url_prefix='/api') 


    with app.app_context():
        from . import models
        try:
            db.create_all()
        except Exception as e:
            print(e)

    return app
