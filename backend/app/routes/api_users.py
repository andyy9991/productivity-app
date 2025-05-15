from flask import Blueprint, jsonify
from app.models import User

users_bp = Blueprint('users', __name__)

@users_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify({
        'id': user.id,
        'name': user.name,
        'level': user.level,
        'xp': user.xp,
        'coins': user.coins,
        'can_use_time_blocks': user.can_use_time_blocks
    }), 200
