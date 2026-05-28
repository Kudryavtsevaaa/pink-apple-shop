import React, { useState, useEffect } from 'react';
import { productsService } from '../services/products';
import ProductCard from '../components/ProductCard';
import './Catalog.css';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cats = await productsService.getCategories();
        setCategories(cats);
        
        const prods = await productsService.getAll();
        setProducts(prods);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category_id === selectedCategory)
    : products;

  if (loading) {
    return <div className="loading">Загрузка товаров...</div>;
  }

  return (
    <div className="catalog">
      <h1>Каталог товаров</h1>
      
      {/* Categories Filter */}
      <div className="categories-filter">
        <button
          className={`filter-btn ${!selectedCategory ? 'active' : ''}`}
          onClick={() => setSelectedCategory(null)}
        >
          Все товары
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="no-products">
            <p>Товары в этой категории не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;