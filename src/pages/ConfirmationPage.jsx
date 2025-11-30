// src/pages/ConfirmationPage.jsx

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import dragonImage from '../assets/dragon_logo.png'; 
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const ConfirmationPage = ({ onNavigate, orderId }) => {
  const [status, setStatus] = useState('Pendiente');

  useEffect(() => {
    if (!orderId) return;

    // 🛑 CONEXIÓN EN VIVO AL PEDIDO ESPECÍFICO 🛑
    const orderRef = doc(db, "orders", orderId);
    const unsubscribe = onSnapshot(orderRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        // Actualizamos el estado local con el estado de la base de datos
        setStatus(docSnapshot.data().status);
      }
    });

    return () => unsubscribe();
  }, [orderId]);

  // Colores según el estado
  const getStatusColor = () => {
    switch(status) {
      case 'Pendiente': return '#FFC404';
      case 'En Preparación': return '#ff6b6b';
      case 'En Camino': return '#4dabf7';
      case 'Entregado': return '#51cf66';
      default: return 'white';
    }
  };

  return (
    <div className="confirmation-page">
      <Header onBack={() => onNavigate('home')} />
      
      <div className="confirmation-content">
        <p className="confirmation-message">¡TU PEDIDO HA SIDO RECIBIDO!</p>
        
        {/* Caja de Estatus en Vivo */}
        <div style={{ 
          marginBottom: '30px', 
          padding: '20px', 
          backgroundColor: '#242424', 
          borderRadius: '10px', 
          border: `2px solid ${getStatusColor()}`,
          width: '100%',
          maxWidth: '400px'
        }}>
          <p style={{ margin: 0, color: '#aaa', fontSize: '0.9rem' }}>Estatus actual:</p>
          <h2 style={{ 
            margin: '10px 0 0 0', 
            color: getStatusColor(), 
            fontSize: '2rem', 
            textTransform: 'uppercase',
            textShadow: '0 0 10px rgba(0,0,0,0.5)' 
          }}>
            {status}
          </h2>
          {status === 'En Camino' && <p style={{ marginTop: '10px', color: 'white' }}>🛵 ¡El repartidor va hacia allá!</p>}
        </div>
        
        <p className="thanks-message">GRACIAS POR SU COMPRA :)</p>
        <img src={dragonImage} alt="Dragón de Confirmación" className="confirmation-dragon" />
        <button className="btn-back-to-start" onClick={() => onNavigate('home')}>VOLVER AL INICIO</button>
      </div>
    </div>
  );
};

export default ConfirmationPage;