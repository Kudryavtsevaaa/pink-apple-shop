import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsService } from '../services/products';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await productsService.getAll();
        setFeaturedProducts(products.slice(0, 6));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Добро пожаловать в мир красоты с Золотым яблоком!</h1>
          <p>
            Наша цель — помочь вам создать идеальный уход за собой с продукцией, 
            которая соответствует самым высоким стандартам. На главной странице 
            нашего магазина вы найдете всё, что нужно для ухода за кожей, 
            волосами и создания безупречного макияжа.
          </p>
          <Link to="/catalog" className="hero-btn">
            Перейти в каталог
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <h2>Категории товаров</h2>
        <div className="categories-grid">
          <div className="category-card">
            <h3>Уход за кожей</h3>
            <p>
              Наша коллекция включает кремы, маски, сыворотки и другие средства 
              для ежедневного ухода, которые подходят для разных типов кожи.
            </p>
          </div>
          
          <div className="category-card">
            <h3>Средства для волос</h3>
            <p>
              Шампуни, кондиционеры, маски и продукты для укладки, которые 
              помогут вашим волосам выглядеть здоровыми и красивыми.
            </p>
          </div>
          
          <div className="category-card">
            <h3>Декоративная косметика</h3>
            <p>
              От тональных средств до помад и теней — мы предлагаем косметику 
              для того, чтобы каждый день был вашим идеальным макияжем.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <h2>Популярные товары</h2>
        <div className="products-grid">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <Link to="/catalog" className="view-all-btn">
          Смотреть все товары
        </Link>
      </section>
    </div>
  );
};

export default Home;
