from flask import Blueprint, request, jsonify
from app.models import db, Shop, User
from sqlalchemy.exc import SQLAlchemyError

rewards_bp = Blueprint('rewards', __name__)

@rewards_bp.route('/rewards', methods=['GET'])
def get_all_rewards():
    """
    Get all available rewards, optionally filtered by user_id and claimed status
    """
    user_id = request.args.get('user_id', type=int)
    claimed = request.args.get('claimed')
    
    query = Shop.query
    
    if user_id:
        query = query.filter_by(user_id=user_id)
    if claimed is not None:
        claimed_bool = claimed.lower() == 'true'
        query = query.filter_by(claimed=claimed_bool)
    
    rewards = query.all()
    
    result = []
    for reward in rewards:
        result.append({
            'id': reward.id,
            'title': reward.title,
            'cost': reward.cost,
            'description': reward.description,
            'claimed': reward.claimed,
            'user_id': reward.user_id
        })
    
    return jsonify(result), 200

@rewards_bp.route('/rewards', methods=['POST'])
def create_reward():
    """
    Create a new reward
    """
    data = request.get_json()
    
    if not data.get('title'):
        return jsonify({'error': 'Reward title is required'}), 400
    
    if not data.get('cost') and data.get('cost') != 0:
        return jsonify({'error': 'Reward cost is required'}), 400
    
    if not data.get('user_id'):
        return jsonify({'error': 'User ID is required'}), 400
    
    new_reward = Shop(
        title=data.get('title'),
        cost=data.get('cost'),
        description=data.get('description'),
        claimed=data.get('claimed', False),
        user_id=data.get('user_id')
    )
    
    try:
        db.session.add(new_reward)
        db.session.commit()
        
        return jsonify({
            'id': new_reward.id,
            'title': new_reward.title,
            'cost': new_reward.cost,
            'description': new_reward.description,
            'claimed': new_reward.claimed,
            'user_id': new_reward.user_id
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@rewards_bp.route('/rewards/<int:reward_id>/claim', methods=['PATCH'])
def claim_reward(reward_id):
    """
    Claim a reward, subtract coins from user, and mark as claimed
    """
    reward = Shop.query.get(reward_id)
    
    if not reward:
        return jsonify({'error': 'Reward not found'}), 404
    
    if reward.claimed:
        return jsonify({'error': 'Reward has already been claimed'}), 400
    
    user = User.query.get(reward.user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    if user.coins < reward.cost:
        return jsonify({'error': 'Not enough coins to claim this reward'}), 400
    
    try:
        user.coins -= reward.cost
        reward.claimed = True
        
        db.session.commit()
        
        return jsonify({
            'id': reward.id,
            'title': reward.title,
            'cost': reward.cost,
            'description': reward.description,
            'claimed': reward.claimed,
            'user_id': reward.user_id,
            'user_coins_remaining': user.coins
        }), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500