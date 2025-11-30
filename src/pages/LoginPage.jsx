// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import Header from '../components/Header';

const LoginPage = ({ onNavigate }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // En una app real, esto se validaría con un servidor.
    // Por ahora, usaremos una contraseña "quemada" en el código.
    if (password === 'dragon123') { // ¡Cambia esto por tu contraseña segura!
      onNavigate('admin'); // Navega al panel de admin
    } else {
      setError('Contraseña incorrecta');
    }
  };

  return (
    <div className="login-page" style={{ minHeight: '100vh', backgroundColor: '#1a1a1a', color: 'white', textAlign: 'center' }}>
      {/* Header sin flecha, o con flecha para volver al home si quieres */}
      <Header onBack={() => onNavigate('home')} />
      
      <div style={{ padding: '40px 20px' }}>
        <h2 style={{ color: '#FFC404', marginBottom: '30px' }}>Acceso Administrador</h2>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '300px', margin: '0 auto' }}>
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white' }}
          />
          
          {error && <p style={{ color: 'red' }}>{error}</p>}
          
          <button 
            type="submit" 
            style={{ padding: '10px', backgroundColor: '#FFC404', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            ENTRAR
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;