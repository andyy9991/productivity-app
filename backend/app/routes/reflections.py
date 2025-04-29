from flask import Blueprint, request, jsonify
from app.models import db, ReflectionLog
from datetime import datetime
from sqlalchemy import func

reflections_bp = Blueprint('reflections', __name__)

@reflections_bp.route('/reflections', methods=['GET'])
def get_reflection_logs():
    """
    Get all reflection logs, optionally filtered by user_id and date
    """
    user_id = request.args.get('user_id', type=int)
    date_str = request.args.get('date')
    time_block = request.args.get('time_block')
    mode = request.args.get('mode')
    
    query = ReflectionLog.query
    
    if user_id:
        query = query.filter_by(user_id=user_id)
    
    if date_str:
        try:
            filter_date = datetime.fromisoformat(date_str).date()
            query = query.filter(func.date(ReflectionLog.date) == filter_date)
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use ISO format (YYYY-MM-DD)'}), 400
    
    if time_block:
        query = query.filter_by(time_block=time_block)
    
    if mode:
        query = query.filter_by(mode=mode)
    
    query = query.order_by(ReflectionLog.date.desc())
    
    reflection_logs = query.all()
    
    result = []
    for log in reflection_logs:
        result.append({
            'id': log.id,
            'date': log.date.isoformat() if log.date else None,
            'time_block': log.time_block,
            'energy_level': log.energy_level,
            'focus_level': log.focus_level,
            'main_task': log.main_task,
            'mode': log.mode,
            'feedback': log.feedback,
            'reflection': log.reflection,
            'user_id': log.user_id
        })
    
    return jsonify(result), 200

@reflections_bp.route('/reflections', methods=['POST'])
def create_reflection_log():
    """
    Create a new reflection log
    """
    data = request.get_json()
    
    # Validation
    if not data.get('time_block'):
        return jsonify({'error': 'Time block is required'}), 400
    
    if 'energy_level' not in data:
        return jsonify({'error': 'Energy level is required'}), 400
    
    if 'focus_level' not in data:
        return jsonify({'error': 'Focus level is required'}), 400
    
    if not data.get('main_task'):
        return jsonify({'error': 'Main task is required'}), 400
    
    if not data.get('user_id'):
        return jsonify({'error': 'User ID is required'}), 400
    
    new_reflection = ReflectionLog(
        date=datetime.fromisoformat(data.get('date')) if data.get('date') else datetime.utcnow(),
        time_block=data.get('time_block'),
        energy_level=data.get('energy_level'),
        focus_level=data.get('focus_level'),
        main_task=data.get('main_task'),
        mode=data.get('mode'),
        feedback=data.get('feedback'),
        reflection=data.get('reflection'),
        user_id=data.get('user_id')
    )
    
    try:
        db.session.add(new_reflection)
        db.session.commit()
        
        return jsonify({
            'id': new_reflection.id,
            'date': new_reflection.date.isoformat() if new_reflection.date else None,
            'time_block': new_reflection.time_block,
            'energy_level': new_reflection.energy_level,
            'focus_level': new_reflection.focus_level,
            'main_task': new_reflection.main_task,
            'mode': new_reflection.mode,
            'feedback': new_reflection.feedback,
            'reflection': new_reflection.reflection,
            'user_id': new_reflection.user_id
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@reflections_bp.route('/reflections/<int:reflection_id>', methods=['PATCH'])
def update_reflection_log(reflection_id):
    """
    Update an existing reflection log
    """
    reflection = ReflectionLog.query.get(reflection_id)
    
    if not reflection:
        return jsonify({'error': 'Reflection log not found'}), 404
    
    data = request.get_json()
    
    # Update fields if they exist in the request
    if 'time_block' in data:
        reflection.time_block = data['time_block']
    if 'energy_level' in data:
        reflection.energy_level = data['energy_level']
    if 'focus_level' in data:
        reflection.focus_level = data['focus_level']
    if 'main_task' in data:
        reflection.main_task = data['main_task']
    if 'mode' in data:
        reflection.mode = data['mode']
    if 'feedback' in data:
        reflection.feedback = data['feedback']
    if 'reflection' in data:
        reflection.reflection = data['reflection']
    if 'date' in data and data['date']:
        reflection.date = datetime.fromisoformat(data['date'])
    
    try:
        db.session.commit()
        
        return jsonify({
            'id': reflection.id,
            'date': reflection.date.isoformat() if reflection.date else None,
            'time_block': reflection.time_block,
            'energy_level': reflection.energy_level,
            'focus_level': reflection.focus_level,
            'main_task': reflection.main_task,
            'mode': reflection.mode,
            'feedback': reflection.feedback,
            'reflection': reflection.reflection,
            'user_id': reflection.user_id
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500