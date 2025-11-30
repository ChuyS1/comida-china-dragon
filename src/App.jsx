// src/App.jsx

import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage'; 
import OrderPage from './pages/OrderPage';
import ConfirmationPage from './pages/ConfirmationPage';
import LoginPage from './pages/LoginPage'; 
import AdminPage from './pages/AdminPage';
import './App.css'; 
import './index.css';

// 1. IMPORTACIONES NECESARIAS PARA ESCUCHAR LA BASE DE DATOS
import { db } from './firebase'; 
import { doc, onSnapshot } from 'firebase/firestore';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(''); 
  
  // Estado del pedido activo
  const [currentOrderId, setCurrentOrderId] = useState(() => {
    return localStorage.getItem('activeOrderId') || null;
  });

  // ✅ NUEVO: MONITOREO AUTOMÁTICO DEL PEDIDO
  useEffect(() => {
    // Si no hay un pedido activo, no gastamos recursos escuchando
    if (!currentOrderId) return;

    console.log("Escuchando actualizaciones del pedido:", currentOrderId);

    // Creamos una referencia al documento específico del pedido
    const orderRef = doc(db, "orders", currentOrderId);

    // onSnapshot es un "oyente" que se activa cada vez que algo cambia en ese pedido en la BD
    const unsubscribe = onSnapshot(orderRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        
        // 🔎 LA REGLA DE ORO:
        // Si el admin pone el estatus como "Entregado", borramos todo.
        if (data.status === 'Entregado') {
          console.log("Pedido entregado. Limpiando rastro...");
          
          // 1. Borramos del almacenamiento del navegador
          localStorage.removeItem('activeOrderId');
          
          // 2. Borramos del estado (Esto hace desaparecer el botón INSTANTÁNEAMENTE)
          setCurrentOrderId(null);
          
          // Opcional: Si el usuario estaba viendo el estatus, lo mandamos al inicio
          if (currentView === 'confirmation' || currentView === 'status') {
            setCurrentView('home');
          }
        }
      } else {
        // Si el documento ya no existe (fue borrado), también limpiamos
        console.log("El pedido ya no existe en la base de datos.");
        localStorage.removeItem('activeOrderId');
        setCurrentOrderId(null);
      }
    }, (error) => {
      console.error("Error escuchando el pedido:", error);
    });

    // Función de limpieza: deja de escuchar si el usuario cierra la app o cambia el ID
    return () => unsubscribe();
  }, [currentOrderId, currentView]); // Se ejecuta cuando cambia el ID o la vista

  // -----------------------------------------------------------------------
  // El resto de tus funciones sigue IGUAL
  // -----------------------------------------------------------------------

  const addToCart = (item) => { 
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

  const removeFromCart = (itemId) => {
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

  const handleOrderCompleted = (newOrderId) => {
    setCurrentOrderId(newOrderId);           
    localStorage.setItem('activeOrderId', newOrderId); 
    setCart([]);                             
    handleNavigate('confirmation');          
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage 
                  onNavigate={() => handleNavigate('menu')}
                  activeOrderId={currentOrderId}
                  onNavigateToStatus={() => handleNavigate('confirmation')} 
               />;
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
          onOrderComplete={handleOrderCompleted}
        />;
      case 'confirmation':
        return <ConfirmationPage 
          onNavigate={() => handleNavigate('home')} 
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