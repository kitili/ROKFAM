from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.product import Product
from models.user import User
from backend import db

products_bp = Blueprint('products', __name__)

@products_bp.route('/', methods=['GET'])
@jwt_required()
def get_products():
    products = Product.query.all()
    return jsonify([product.to_dict() for product in products]), 200

@products_bp.route('/<int:product_id>', methods=['GET'])
@jwt_required()
def get_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    return jsonify(product.to_dict()), 200

@products_bp.route('/', methods=['POST'])
@jwt_required()
def create_product():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    product = Product(
        name=data['name'],
        description=data.get('description'),
        sku=data['sku'],
        category=data['category'],
        unit_price=data['unit_price'],
        cost_price=data['cost_price'],
        quantity_in_stock=data.get('quantity_in_stock', 0),
        minimum_stock_level=data.get('minimum_stock_level', 10)
    )
    
    db.session.add(product)
    db.session.commit()
    
    return jsonify(product.to_dict()), 201

@products_bp.route('/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    data = request.get_json()
    for key, value in data.items():
        if hasattr(product, key):
            setattr(product, key, value)
    
    db.session.commit()
    return jsonify(product.to_dict()), 200

@products_bp.route('/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    db.session.delete(product)
    db.session.commit()
    
    return jsonify({'message': 'Product deleted successfully'}), 200 