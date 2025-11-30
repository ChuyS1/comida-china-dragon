// src/pages/OrderPage.jsx

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
// Importaciones para Firebase
import { db } from '../firebase'; 
import { collection, addDoc } from 'firebase/firestore';

// Recibimos 'setCurrentOrderId' para guardar el ID del pedido
const OrderPage = ({ onNavigate, cart, total, paymentMethod, setCurrentOrderId }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    comentarios: '',
  });
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    const newOrder = {
      date: new Date().toLocaleString(),
      timestamp: new Date(),
      customer: formData,
      items: cart,
      total: total,
      paymentMethod: paymentMethod || 'No especificado',
      status: 'Pendiente'
    };

    try {
      // 1. GUARDAR EN FIREBASE
      const docRef = await addDoc(collection(db, "orders"), newOrder);
      
      // 🛑 AQUÍ GUARDAMOS EL ID DEL PEDIDO 🛑
      // Esto permite que la ConfirmationPage sepa qué pedido rastrear
      setCurrentOrderId(docRef.id);

      // 2. WHATSAPP (Opcional, para notificarte)
      const productosTexto = cart.map(item => 
        `- ${item.quantity}x ${item.name} ($${item.price * item.quantity})`
      ).join('\n');

      const mensaje = `
🥡 *NUEVO PEDIDO WEB* 🥡
ID: ${docRef.id}
Cliente: ${formData.nombre}
Total: $${total}
Pago: ${paymentMethod}

*Productos:*
${productosTexto}
      `.trim();

      const numeroTelefono = '524411151169'; 
      const urlWhatsApp = `https://wa.me/${numeroTelefono}?text=${encodeURIComponent(mensaje)}`;
      
      // Abrimos WhatsApp en una pestaña nueva
      window.open(urlWhatsApp, '_blank');

      // 3. IR A CONFIRMACIÓN
      onNavigate('confirmation'); 

    } catch (error) {
      console.error("Error al enviar:", error);
      alert("Error al enviar pedido. Revisa tu conexión.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="order-page">
      <Header onBack={() => onNavigate('cart')} />
      
      <div className="order-content">
        <h2 className="order-title">DATOS DE ENVÍO</h2>
        
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#242424', borderRadius: '8px', border: '1px solid #444' }}>
          <p style={{ color: 'white', margin: '0' }}>Total a pagar:</p>
          <p style={{ color: '#FFC404', fontSize: '1.8rem', fontWeight: 'bold', margin: '5px 0' }}>
            ${total}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="shipping-form">
          <label>Nombre</label>
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required placeholder="Tu nombre completo" />

          <label>Teléfono</label>
          <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required placeholder="10 dígitos" />

          <label>Dirección</label>
          <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} required placeholder="Calle, número, colonia" />

          <label>Comentarios</label>
          <textarea name="comentarios" rows="3" value={formData.comentarios} onChange={handleChange} placeholder="Instrucciones..." />

          <div className="form-buttons">
            <button type="submit" className="btn-order" disabled={isSending}>
              {isSending ? "ENVIANDO..." : "CONFIRMAR PEDIDO"}
            </button>
            <button type="button" className="btn-cancel" onClick={() => onNavigate('cart')} disabled={isSending}>
              VOLVER
            </button>
          </div>
        </form>
      </div>
      <Footer /> 
    </div>
  );
};

export default OrderPage;