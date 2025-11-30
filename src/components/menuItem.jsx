// src/components/menuItem.jsx

import React from 'react';

// Recibimos 'image' como prop y la usamos en la etiqueta <img>
const MenuItem = ({ name, price, image, onAdd }) => {
  return (
    <div className="menu-item">
      {/* Aquí se muestra la imagen. Si 'image' tiene una ruta válida, debería verse */}
      <img 
        src={image} 
        alt={name} 
        className="item-image"
        // Esto ocultaría la imagen rota si la ruta es incorrecta
        onError={(e) => { e.target.style.display = 'none'; console.error("Error cargando imagen:", image); }} 
      />
      <div className="item-details">
        <p className="item-name">{name}</p>
        <p className="item-price">${price}</p>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
          style={{
            marginTop: '5px',
            padding: '5px 15px',
            backgroundColor: '#FFC404',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          AGREGAR +
        </button>
      </div>
    </div>
  );
};

export default MenuItem;