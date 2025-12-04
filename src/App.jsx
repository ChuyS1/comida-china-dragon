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

// Importaciones para Firebase (Base de datos en tiempo real)
import { db } from './firebase'; 
import { doc, onSnapshot } from 'firebase/firestore';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(''); 
  
  // 1. ESTADO DEL PEDIDO: Inicializamos buscando en la memoria del navegador
  const [currentOrderId, setCurrentOrderId] = useState(() => {
    return localStorage.getItem('activeOrderId') || null;
  });

  // 2. EFECTO: Monitoreo automático del pedido en tiempo real
  useEffect(() => {
    // Si no hay pedido activo, no hacemos nada
    if (!currentOrderId) return;

    console.log("Escuchando actualizaciones del pedido:", currentOrderId);
    const orderRef = doc(db, "orders", currentOrderId);

    // Escuchamos cambios en la base de datos
    const unsubscribe = onSnapshot(orderRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        
        // Si el admin marca como "Entregado", limpiamos todo
        if (data.status === 'Entregado') {
          console.log("Pedido entregado. Limpiando...");
          localStorage.removeItem('activeOrderId');
          setCurrentOrderId(null);
          
          // Si el usuario estaba viendo el estatus, lo mandamos al inicio
          if (currentView === 'confirmation' || currentView === 'status') {
            setCurrentView('home');
          }
        }
      } else {
        // Si el pedido fue borrado de la BD
        localStorage.removeItem('activeOrderId');
        setCurrentOrderId(null);
      }
    }, (error) => {
      console.error("Error escuchando el pedido:", error);
    });

    return () => unsubscribe();
  }, [currentOrderId, currentView]);

  // Funciones del Carrito
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

  // Cálculos del carrito
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Navegación principal
  const handleNavigate = (viewName) => {
    setCurrentView(viewName);
    window.scrollTo(0, 0);
  };

  // 3. FUNCIÓN AL COMPLETAR PEDIDO: Guarda ID y limpia carrito
  const handleOrderCompleted = (newOrderId) => {
    setCurrentOrderId(newOrderId);           
    localStorage.setItem('activeOrderId', newOrderId); 
    setCart([]); // Vaciamos el carrito tras la compra                             
    handleNavigate('confirmation');          
  };

  // Renderizado de Vistas
  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage 
                  onNavigate={() => handleNavigate('menu')}
                  activeOrderId={currentOrderId}
                  onNavigateToStatus={() => handleNavigate('confirmation')}
                  // Props para el carrito clickeable en Home
                  cartCount={cartCount}
                  onGoToCart={() => handleNavigate('cart')}
               />;
      case 'menu':
        return <MenuPage 
          onNavigate={handleNavigate} 
          addToCart={addToCart} 
          cartCount={cartCount} 
          // Props para el carrito clickeable en Menú
          onGoToCart={() => handleNavigate('cart')}
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
      
      {/* Botón Flotante de Admin en el Home */}
      {currentView === 'home' && (
        <button 
          onClick={() => handleNavigate('login')} 
          style={{
            position: 'fixed', 
            bottom: '20px', 
            right: '20px', 
            opacity: 1, 
            background: '#FFC404', 
            border: '1px solid black', 
            color: 'black', 
            padding: '8px 12px', 
            borderRadius: '5px', 
            cursor: 'pointer', 
            zIndex: 9999, 
            fontSize: '0.8rem', 
            fontWeight: 'bold', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.4)'
          }}
        >
          Admin
        </button>
      )}
    </div>
  );
}

export default App;