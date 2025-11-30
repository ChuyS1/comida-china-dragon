// src/pages/MenuPage.jsx

import React from 'react';
import Header from '../components/Header';
import MenuItem from '../components/menuItem'; 
import { menuItems } from '../menuData'; 

const MenuPage = ({ onNavigate, addToCart, cartCount }) => {
  return (
    <div className="menu-page">
      {/* Pasamos cartCount para que se vea el contador del carrito.
        NO pasamos 'onBack', por lo que NO saldrá la flecha de regreso.
      */}
      <Header cartCount={cartCount} />

      <h2 className="menu-title">Nuestro Menú</h2>
      
      <div className="menu-list-container">
        {menuItems.map(item => (
          <MenuItem
            key={item.id}
            name={item.name}
            price={item.price}
            image={item.image}
            // Conectamos el botón AGREGAR + con la función del carrito
            onAdd={() => addToCart(item)} 
          />
        ))}
      </div>

      {/* El botón inferior cambia dinámicamente:
        - Si tienes productos: Te dice cuántos y te lleva al Carrito ('cart').
        - Si está vacío: Te pide agregar platillos.
      */}
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