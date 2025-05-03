from app import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(255), nullable=True)  # might need to use proper password hashing
    xp = db.Column(db.Integer, default=0)
    level = db.Column(db.Integer, default=1)
    coins = db.Column(db.Integer, default=0)

    # Relationships
    tasks = db.relationship("Task", back_populates="user")
    rewards = db.relationship("Shop", back_populates="user")
    reflection_logs = db.relationship("ReflectionLog", back_populates="user")

    def __repr__(self):
        return f"<User(name='{self.name}', level={self.level})>"

class Task(db.Model):
    __tablename__ = 'tasks'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    xp_reward = db.Column(db.Integer, default=0)
    coin_reward = db.Column(db.Integer, default=0)
    category = db.Column(db.String(100), nullable=True)
    difficulty = db.Column(db.String(50), nullable=False)
    motivation_resistance = db.Column(db.String(50), nullable=False)
    time = db.Column(db.String(20), nullable=True)
    done = db.Column(db.Boolean, default=False)
    to_be_done_today = db.Column(db.Boolean, default=False)
    
    # Foreign keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    
    # Relationships
    user = db.relationship("User", back_populates="tasks")
    
    def __repr__(self):
        return f"<Task(title='{self.title}', done={self.done})>"

class Shop(db.Model):
    __tablename__ = 'shop'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    cost = db.Column(db.Integer, nullable=False)
    description = db.Column(db.Text, nullable=True)
    claimed = db.Column(db.Boolean, default=False)
    
    # Foreign keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    
    # Relationships
    user = db.relationship("User", back_populates="rewards")
    
    def __repr__(self):
        return f"<Shop(title='{self.title}', cost={self.cost})>"
    
class ReflectionLog(db.Model):
    __tablename__ = 'reflection_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    time_block = db.Column(db.String(100), nullable=False)
    energy_level = db.Column(db.Integer, nullable=False)
    focus_level = db.Column(db.Integer, nullable=False)
    main_task = db.Column(db.String(200), nullable=False)
    mode = db.Column(db.String(50), nullable=True)
    feedback = db.Column(db.Text, nullable=True)
    reflection = db.Column(db.Text, nullable=True)
    
    # Foreign keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    
    # Relationships
    user = db.relationship("User", back_populates="reflection_logs")
    
    def __repr__(self):
        return f"<ReflectionLog(date='{self.date}', time_block='{self.time_block}')>"
