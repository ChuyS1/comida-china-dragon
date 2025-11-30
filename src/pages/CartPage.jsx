// src/pages/CartPage.jsx

import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Recibimos todas las funciones y estados necesarios, incluyendo los del pago
const CartPage = ({ 
  onNavigate, 
  cart, 
  total, 
  addToCart, 
  removeFromCart, 
  deleteFromCart,
  paymentMethod,
  setPaymentMethod 
}) => {
  return (
    <div className="cart-page">
      <Header onBack={() => onNavigate('menu')} />
      
      <div className="cart-content">
        <h2 className="cart-title">TU PEDIDO</h2>
        
        {(!cart || cart.length === 0) ? (
          <div className="empty-cart">
            <p>Tu carrito está vacío.</p>
            <button className="btn-back-menu" onClick={() => onNavigate('menu')}>
              IR AL MENÚ
            </button>
          </div>
        ) : (
          <>
            {/* LISTA DE PRODUCTOS */}
            <div className="cart-items-list">
              {cart.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="cart-item-img" 
                    onError={(e) => { e.target.style.display = 'none'; }} 
                  />
                  
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <p className="cart-item-price">${item.price}</p>
                  </div>

                  <div className="qty-controls">
                    <button className="btn-qty" onClick={() => removeFromCart(item.id)}>-</button>
                    <span className="qty-number">{item.quantity}</span>
                    <button className="btn-qty" onClick={() => addToCart(item)}>+</button>
                  </div>

                  <button className="btn-delete" onClick={() => deleteFromCart(item.id)}>🗑️</button>
                </div>
              ))}
            </div>
            
            {/* SECCIÓN DE TOTAL Y PAGO */}
            <div className="cart-total-section">
              <div className="cart-total-row">
                <span>TOTAL:</span>
                <span>${total}</span>
              </div>

              {/* 🛑 SELECCIÓN DE MÉTODO DE PAGO 🛑 */}
              <div className="payment-section">
                <h3 className="payment-title">Método de Pago:</h3>
                
                <div className="payment-options">
                  {/* Opción Transferencia */}
                  <label 
                    className={`payment-option ${paymentMethod === 'transferencia' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('transferencia')}
                  >
                    <span className="radio-circle">{paymentMethod === 'transferencia' ? '●' : ''}</span>
                    Transferencia
                  </label>

                  {/* Opción Efectivo */}
                  <label 
                    className={`payment-option ${paymentMethod === 'efectivo' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('efectivo')}
                  >
                    <span className="radio-circle">{paymentMethod === 'efectivo' ? '●' : ''}</span>
                    Efectivo
                  </label>
                </div>

                {/* Mensajes de instrucciones según la selección */}
                {paymentMethod === 'transferencia' && (
                  <div className="payment-info-box">
                    <p><strong>Banco:</strong> BBVA</p>
                    <p><strong>Cuenta:</strong> 0486664938</p>
                    <p className="payment-instruction">
                      * Transfiere a esta cuenta a nombre de J.Hortencio Ramirez y envía comprobante al número 441-276-7498.
                    </p>
                  </div>
                )}

                {paymentMethod === 'efectivo' && (
                  <div className="payment-info-box">
                    <p className="payment-instruction">
                      * Pagar al repartidor al llegar su pedido.
                    </p>
                  </div>
                )}
              </div>
              
              {/* Botón Continuar (Deshabilitado si no elige pago) */}
              <button 
                className="btn-proceed" 
                onClick={() => onNavigate('order')}
                disabled={!paymentMethod} 
                style={{ opacity: !paymentMethod ? 0.5 : 1, cursor: !paymentMethod ? 'not-allowed' : 'pointer' }}
              >
                CONTINUAR CON EL ENVÍO
              </button>
            </div>
          </>
        )}
      </div>

      <Footer /> 
    </div>
  );
};

export default CartPage;