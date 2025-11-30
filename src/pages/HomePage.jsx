// src/pages/HomePage.jsx

import React from 'react';
import Header from '../components/Header';
import dragonImage from '../assets/dragon_logo.png'; 
import backgroundImage from '../assets/chinese_ingredients_bg.jpg'; 

const HomePage = ({ onNavigate }) => {
  return (
    <div className="home-page home-page-background"> 
      {/* Aquí usamos el Header SIN la prop 'onBack'.
        Al no pasarle onBack, la flecha NO se renderizará.
      */}
      <Header />

      <div className="welcome-section">
        <h2 className="welcome-title">Bienvenido a Comida China Dragon</h2>
        <img 
          src={dragonImage} 
          alt="Logo del Dragón" 
          className="home-dragon-logo" 
        />

        <div className="menu-cta" onClick={onNavigate}>
          <div className="menu-text">
            <span className="icon-menu-bar">II</span> MENU
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomePage;