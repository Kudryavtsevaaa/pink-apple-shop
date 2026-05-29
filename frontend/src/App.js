import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import CartPage from './pages/CartPage';
import Admin from './pages/Admin';
import Login from './pages/Login';
import PwaManager from './components/PwaManager';
import OfflineBanner from './components/OfflineBanner';
import './App.css';

function App() {
  return (
    <div className="App">
      <PwaManager />
      <OfflineBanner />
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<Login />} /> 
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;