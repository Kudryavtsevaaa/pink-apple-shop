import React from 'react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
  
    const handleAddToCart = () => {
      if (product.stock_quantity <= 0) {
        alert('❌ Товар закончился!');
        return;
      }
      addToCart(product, 1);
      alert(`✅ ${product.name} добавлен в корзину!`);
    };
  
    const isOutOfStock = product.stock_quantity <= 0;
  
    return (
      <div className="product-card">
        <div className="product-image">
          <img 
            src={product.image_url || '/images/placeholder.jpg'} 
            alt={product.name}
            onError={(e) => {
              e.target.src = '/images/placeholder.jpg';
            }}
          />
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-description">{product.description}</p>
          <div className="product-price">
            {Number(product.price).toLocaleString('ru-RU')} руб.
          </div>
          
          {/* Показываем остаток */}
          <div className={`stock-info ${isOutOfStock ? 'out-of-stock' : 'in-stock'}`}>
            {isOutOfStock ? (
              <span>❌ Нет в наличии</span>
            ) : (
              <span>✅ В наличии: {product.stock_quantity} шт.</span>
            )}
          </div>
          
          <button 
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? 'Нет в наличии' : 'Добавить в корзину'}
          </button>
        </div>
      </div>
    );
  };
  
  export default ProductCard;