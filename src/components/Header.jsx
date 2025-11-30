// src/components/Header.jsx

import React from 'react';

// Recibimos 'cartCount' para saber cuántos productos hay
const Header = ({ onBack, cartCount }) => {
  return (
    <header className="app-header">
      <div className="header-left">
        {onBack && (
          <button className="back-button" onClick={onBack}>
            <span className="icon-back">←</span> 
          </button>
        )}
      </div>
      
      <div className="header-center">
        <h1>COMIDA CHINA DRAGON</h1>
      </div>
      
      <div className="header-right">
        {/* 🛒 Si hay productos (cartCount > 0), mostramos el contador 🛒 */}
        {cartCount > 0 && (
          <div className="cart-indicator">
            <span className="cart-icon">🛒</span>
            <span className="cart-count">{cartCount}</span>
          </div>
        )}
        
        <button className="menu-button-icon">
          <span className="icon-hamburger">≡</span> 
        </button>
      </div>
    </header>
  );
};

export default Header;