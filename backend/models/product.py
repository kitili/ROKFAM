from datetime import datetime
from backend import db

class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    sku = db.Column(db.String(50), unique=True, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    unit_price = db.Column(db.Float, nullable=False)
    cost_price = db.Column(db.Float, nullable=False)
    quantity_in_stock = db.Column(db.Integer, default=0)
    minimum_stock_level = db.Column(db.Integer, default=10)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    sales = db.relationship('SaleItem', backref='product', lazy=True)
    
    def __repr__(self):
        return f'<Product {self.name}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'sku': self.sku,
            'category': self.category,
            'unit_price': self.unit_price,
            'cost_price': self.cost_price,
            'quantity_in_stock': self.quantity_in_stock,
            'minimum_stock_level': self.minimum_stock_level,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        } 