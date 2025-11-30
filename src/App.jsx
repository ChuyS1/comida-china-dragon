// src/App.jsx

import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage'; 
import OrderPage from './pages/OrderPage';
import ConfirmationPage from './pages/ConfirmationPage';
import LoginPage from './pages/LoginPage'; 
import AdminPage from './pages/AdminPage';
import './App.css'; 
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(''); 
  
  // 🆔 NUEVO ESTADO: Guardamos el ID del último pedido para mostrar su estatus
  const [currentOrderId, setCurrentOrderId] = useState(null);

  const addToCart = (item) => { /* ... (código igual) ... */
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId) => { /* ... (código igual) ... */
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === itemId);
      if (existingItem.quantity === 1) {
        return prevCart.filter((item) => item.id !== itemId);
      } else {
        return prevCart.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
    });
  };

  const deleteFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const handleNavigate = (viewName) => {
    setCurrentView(viewName);
    window.scrollTo(0, 0);
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage onNavigate={() => handleNavigate('menu')} />;
      case 'menu':
        return <MenuPage 
          onNavigate={handleNavigate} 
          addToCart={addToCart} 
          cartCount={cartCount} 
        />;
      case 'cart':
        return <CartPage 
          onNavigate={handleNavigate} 
          cart={cart} 
          total={cartTotal}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          deleteFromCart={deleteFromCart}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />;
      case 'order':
        return <OrderPage 
          onNavigate={handleNavigate} 
          cart={cart} 
          total={cartTotal} 
          paymentMethod={paymentMethod}
          // Pasamos la función para guardar el ID del pedido
          setCurrentOrderId={setCurrentOrderId}
        />;
      case 'confirmation':
        return <ConfirmationPage 
          onNavigate={() => handleNavigate('home')} 
          // Pasamos el ID para que la página sepa qué buscar
          orderId={currentOrderId}
        />;
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;
      case 'admin':
        return <AdminPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={() => handleNavigate('menu')} />;
    }
  };

  return (
    <div className="app-container">
      {renderView()}
      {currentView === 'home' && (
        <button 
          onClick={() => handleNavigate('login')} 
          style={{position: 'fixed', bottom: '20px', right: '20px', opacity: 1, background: '#FFC404', border: '1px solid black', color: 'black', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', zIndex: 9999, fontSize: '0.8rem', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.4)'}}
        >
          Admin
        </button>
      )}
    </div>
  );
}

export default App;