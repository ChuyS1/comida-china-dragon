// src/pages/MenuPage.jsx

import React from 'react';
import Header from '../components/Header';
import MenuItem from '../components/menuItem'; 
import { menuItems } from '../menuData'; 

const MenuPage = ({ onNavigate, addToCart, cartCount, onGoToCart }) => {
  return (
    <div className="menu-page">
      {/* ✅ CAMBIO AQUÍ: Agregamos 'onBack' */}
      <Header 
        onBack={() => onNavigate('home')} // Esto activa la flecha "←" para volver al inicio
        cartCount={cartCount} 
        onCartClick={onGoToCart} 
      />

      <h2 className="menu-title">Nuestro Menú</h2>
      
      <div className="menu-list-container">
        {menuItems.map(item => (
          <MenuItem
            key={item.id}
            name={item.name}
            price={item.price}
            image={item.image}
            onAdd={() => addToCart(item)} 
          />
        ))}
      </div>

      <button 
        className="next-page-button" 
        onClick={() => cartCount > 0 ? onNavigate('cart') : alert("Por favor, agrega platillos a tu pedido primero.")}
      >
        {cartCount > 0 
          ? `VER MI CARRITO (${cartCount})` 
          : "VER CARRITO"}
      </button>
    </div>
  );
};

export default MenuPage;