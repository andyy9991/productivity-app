from flask import Blueprint, request, jsonify
from app import db
from app.models import Task

tasks_bp = Blueprint('tasks', __name__)

@tasks_bp.route('/tasks', methods=['GET'])
def get_all_tasks():
    """
    Get all tasks, optionally filtered by user_id and other query parameters
    """
    user_id = request.args.get('user_id', type=int)
    category = request.args.get('category')
    difficulty = request.args.get('difficulty')
    done = request.args.get('done')
    to_be_done_today = request.args.get('to_be_done_today')
    
    query = Task.query
    
    if user_id:
        query = query.filter_by(user_id=user_id)
    if category:
        query = query.filter_by(category=category)
    if difficulty:
        query = query.filter_by(difficulty=difficulty)
    if done is not None:
        done_bool = done.lower() == 'true'
        query = query.filter_by(done=done_bool)
    if to_be_done_today is not None:
        today_bool = to_be_done_today.lower() == 'true'
        query = query.filter_by(to_be_done_today=today_bool)
    
    tasks = query.all()
    
    result = []
    for task in tasks:
        result.append({
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'xp_reward': task.xp_reward,
            'coin_reward': task.coin_reward,
            'category': task.category,
            'difficulty': task.difficulty,
            'motivation_resistance': task.motivation_resistance,
            'time': task.time,
            'done': task.done, 
            'to_be_done_today': task.to_be_done_today,
            'user_id': task.user_id
        })
    
    return jsonify(result), 200

@tasks_bp.route('/tasks', methods=['POST'])
def create_task():
    """
    Create a new task
    """
    data = request.get_json()
    
    if not data.get('title'):
        return jsonify({'error': 'Task title is required'}), 400
    
    if not data.get('difficulty'):
        return jsonify({'error': 'Task difficulty is required'}), 400
    
    if not data.get('motivation_resistance'):
        return jsonify({'error': 'Task motivation resistance is required'}), 400
    
    if not data.get('user_id'):
        return jsonify({'error': 'User ID is required'}), 400
    
    new_task = Task(
        title=data.get('title'),
        description=data.get('description'),
        xp_reward=data.get('xp_reward', 0),
        coin_reward=data.get('coin_reward', 0),
        category=data.get('category'),
        difficulty=data.get('difficulty'),
        motivation_resistance=data.get('motivation_resistance'),
        time=data.get('time'),
        done=data.get('done', False),
        to_be_done_today=data.get('to_be_done_today', False),
        user_id=data.get('user_id')
    )
    
    try:
        db.session.add(new_task)
        db.session.commit()
        
        return jsonify({
            'id': new_task.id,
            'title': new_task.title,
            'description': new_task.description,
            'xp_reward': new_task.xp_reward,
            'coin_reward': new_task.coin_reward,
            'category': new_task.category,
            'difficulty': new_task.difficulty,
            'motivation_resistance': new_task.motivation_resistance,
            'time': new_task.time,
            'done': new_task.done,
            'to_be_done_today': new_task.to_be_done_today,
            'user_id': new_task.user_id
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@tasks_bp.route('/tasks/<int:task_id>', methods=['PATCH'])
def update_task(task_id):
    """
    Update an existing task
    """
    task = Task.query.get(task_id)
    
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    
    data = request.get_json()
    
    if 'title' in data:
        task.title = data['title']
    if 'description' in data:
        task.description = data['description']
    if 'xp_reward' in data:
        task.xp_reward = data['xp_reward']
    if 'coin_reward' in data:
        task.coin_reward = data['coin_reward']
    if 'category' in data:
        task.category = data['category']
    if 'difficulty' in data:
        task.difficulty = data['difficulty']
    if 'motivation_resistance' in data:
        task.motivation_resistance = data['motivation_resistance']
    if 'time' in data:
        task.time = data['time']
    if 'done' in data:
        task.done = data['done']
    if 'to_be_done_today' in data:
        task.to_be_done_today = data['to_be_done_today']
    
    try:
        db.session.commit()
        
        return jsonify({
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'xp_reward': task.xp_reward,
            'coin_reward': task.coin_reward,
            'category': task.category,
            'difficulty': task.difficulty,
            'motivation_resistance': task.motivation_resistance,
            'time': task.time,
            'done': task.done,
            'to_be_done_today': task.to_be_done_today,
            'user_id': task.user_id
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@tasks_bp.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    """
    Delete a task
    """
    task = Task.query.get(task_id)
    
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    
    try:
        db.session.delete(task)
        db.session.commit()
        return jsonify({'message': f'Task {task_id} deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500