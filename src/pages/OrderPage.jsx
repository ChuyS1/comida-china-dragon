// src/pages/OrderPage.jsx

import React, { useState, useEffect } from 'react'; // 1. Importamos useEffect
import Header from '../components/Header';
import Footer from '../components/Footer';
import { db } from '../firebase'; 
import { collection, addDoc } from 'firebase/firestore';

// ⚠️ CAMBIO IMPORTANTE EN PROPS:
// Cambiamos 'setCurrentOrderId' por 'onOrderComplete' para que coincida con tu nuevo App.jsx
const OrderPage = ({ onNavigate, cart, total, paymentMethod, onOrderComplete }) => {
  
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    comentarios: '',
  });
  const [isSending, setIsSending] = useState(false);

  // ✅ 2. MEMORIA: CARGAR DATOS DEL CLIENTE
  // Al abrir la página, buscamos si hay datos guardados
  useEffect(() => {
    const savedData = localStorage.getItem('customerData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      // Solo recuperamos datos personales, los comentarios los dejamos en blanco
      setFormData(prev => ({
        ...prev,
        nombre: parsedData.nombre || '',
        telefono: parsedData.telefono || '',
        direccion: parsedData.direccion || ''
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    // ✅ 3. MEMORIA: GUARDAR DATOS DEL CLIENTE
    // Guardamos nombre, teléfono y dirección para la próxima vez
    const dataToSave = {
      nombre: formData.nombre,
      telefono: formData.telefono,
      direccion: formData.direccion
    };
    localStorage.setItem('customerData', JSON.stringify(dataToSave));

    const newOrder = {
      date: new Date().toLocaleString(),
      timestamp: new Date(),
      customer: formData,
      items: cart,
      total: total,
      paymentMethod: paymentMethod || 'No especificado',
      status: 'Pendiente' // Estado inicial para Firebase
    };

    try {
      // 1. GUARDAR EN FIREBASE
      const docRef = await addDoc(collection(db, "orders"), newOrder);
      
      // 2. WHATSAPP
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
*Dir:* ${formData.direccion}
*Comentarios:* ${formData.comentarios}
      `.trim();

      const numeroTelefono = '524411151169'; 
      const urlWhatsApp = `https://wa.me/${numeroTelefono}?text=${encodeURIComponent(mensaje)}`;
      
      // Abrimos WhatsApp
      window.open(urlWhatsApp, '_blank');

      // ✅ 4. FINALIZAR PROCESO INTELIGENTE
      // Usamos la función que viene de App.jsx que hace tres cosas:
      // a) Guarda el ID en memoria, b) Limpia el carrito, c) Navega a confirmación
      if (onOrderComplete) {
        onOrderComplete(docRef.id);
      } else {
        // Respaldo por si acaso
        onNavigate('confirmation');
      }

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
          <textarea name="comentarios" rows="3" value={formData.comentarios} onChange={handleChange} placeholder="Instrucciones especiales..." />

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