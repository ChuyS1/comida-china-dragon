// src/components/Header.jsx

import React from 'react';

// Agregamos 'onCartClick' a las propiedades que recibe el componente
const Header = ({ onBack, cartCount, onCartClick }) => {
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
        {/* 🛒 Si hay productos, mostramos el contador y lo hacemos CLICKEABLE 🛒 */}
        {cartCount > 0 && (
          <div 
            className="cart-indicator" 
            onClick={onCartClick} // <--- AQUÍ ESTÁ LA MAGIA
            style={{ cursor: 'pointer', marginRight: '10px' }} // Cursor de manita
          >
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