// src/pages/HomePage.jsx

import React from 'react';
import Header from '../components/Header';
import dragonImage from '../assets/dragon_logo.png'; 
import backgroundImage from '../assets/chinese_ingredients_bg.jpg'; 

// 1. Recibimos las nuevas props: cartCount y onGoToCart
const HomePage = ({ onNavigate, activeOrderId, onNavigateToStatus, cartCount, onGoToCart }) => {
  return (
    <div className="home-page home-page-background"> 
      
      {/* 2. Pasamos esas props al Header para que el carrito sea clickeable */}
      <Header 
        cartCount={cartCount} 
        onCartClick={onGoToCart} 
      />

      <div className="welcome-section">
        <h2 className="welcome-title">Bienvenido a Comida China Dragon</h2>
        <img 
          src={dragonImage} 
          alt="Logo del Dragón" 
          className="home-dragon-logo" 
        />

        {/* --- BOTÓN 1: IR AL MENÚ (Siempre visible) --- */}
        <div className="menu-cta" onClick={onNavigate}>
          <div className="menu-text">
            <span className="icon-menu-bar">II</span> MENU
          </div>
        </div>

        {/* --- BOTÓN 2: VER ESTATUS (Solo visible si hay pedido) --- */}
        {activeOrderId && (
          <div 
            className="status-cta" 
            onClick={onNavigateToStatus}
            style={{
              marginTop: '20px',
              backgroundColor: '#FFC107', // Amarillo dorado para destacar
              color: '#333',
              padding: '12px 24px',
              borderRadius: '30px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
              border: '2px solid #FFA000',
              animation: 'pulse 2s infinite', // Efecto de latido suave
              maxWidth: '250px' // Para que no sea más ancho que el menú
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>🚚</span>
            VER MI PEDIDO
          </div>
        )}

      </div>
    </div>
  );
};

export default HomePage;