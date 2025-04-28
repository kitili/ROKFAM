from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_socketio import emit
from datetime import datetime
from models.sale import Sale, SaleItem
from models.product import Product
from models.user import User
from backend import db, socketio

sales_bp = Blueprint('sales', __name__)

@sales_bp.route('/', methods=['GET'])
@jwt_required()
def get_sales():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role == 'admin':
        sales = Sale.query.all()
    else:
        sales = Sale.query.filter_by(user_id=user_id).all()
    
    return jsonify([sale.to_dict() for sale in sales]), 200

@sales_bp.route('/<int:sale_id>', methods=['GET'])
@jwt_required()
def get_sale(sale_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    sale = Sale.query.get(sale_id)
    if not sale:
        return jsonify({'error': 'Sale not found'}), 404
    
    if user.role != 'admin' and sale.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    return jsonify(sale.to_dict()), 200

@sales_bp.route('/', methods=['POST'])
@jwt_required()
def create_sale():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Create sale
    sale = Sale(
        user_id=user_id,
        total_amount=0,  # Will be calculated
        payment_method=data['payment_method'],
        status='completed'
    )
    db.session.add(sale)
    db.session.flush()  # Get sale.id
    
    total_amount = 0
    
    # Create sale items and update stock
    for item in data['items']:
        product = Product.query.get(item['product_id'])
        if not product:
            db.session.rollback()
            return jsonify({'error': f'Product {item["product_id"]} not found'}), 404
        
        if product.quantity_in_stock < item['quantity']:
            db.session.rollback()
            return jsonify({'error': f'Insufficient stock for product {product.name}'}), 400
        
        # Create sale item
        sale_item = SaleItem(
            sale_id=sale.id,
            product_id=product.id,
            quantity=item['quantity'],
            unit_price=product.unit_price,
            total_price=product.unit_price * item['quantity']
        )
        db.session.add(sale_item)
        
        # Update stock
        product.quantity_in_stock -= item['quantity']
        total_amount += sale_item.total_price
    
    # Update sale total
    sale.total_amount = total_amount
    db.session.commit()
    
    # Emit real-time notification
    socketio.emit('new_sale', {
        'sale_id': sale.id,
        'total_amount': sale.total_amount,
        'timestamp': datetime.utcnow().isoformat()
    })
    
    return jsonify(sale.to_dict()), 201

@sales_bp.route('/<int:sale_id>', methods=['DELETE'])
@jwt_required()
def delete_sale(sale_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    sale = Sale.query.get(sale_id)
    if not sale:
        return jsonify({'error': 'Sale not found'}), 404
    
    # Restore stock
    for item in sale.items:
        product = Product.query.get(item.product_id)
        product.quantity_in_stock += item.quantity
    
    db.session.delete(sale)
    db.session.commit()
    
    return jsonify({'message': 'Sale deleted successfully'}), 200 