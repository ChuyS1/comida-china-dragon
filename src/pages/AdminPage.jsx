// src/pages/AdminPage.jsx

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
// Importamos la base de datos y las funciones de Firebase
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const AdminPage = ({ onNavigate }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. CONEXIÓN EN TIEMPO REAL
    // Creamos una consulta para escuchar la colección "orders" ordenada por fecha
    const q = query(collection(db, "orders"), orderBy("timestamp", "desc"));

    // onSnapshot se queda "escuchando" cambios en la base de datos
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id, // ID único del documento en Firebase
        ...doc.data()
      }));
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      console.error("Error obteniendo pedidos:", error);
      setLoading(false);
    });

    // Limpiamos la conexión cuando te sales de la página
    return () => unsubscribe();
  }, []);

  // Función para cambiar el estado del pedido en la nube
  const updateStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
    } catch (error) {
      console.error("Error actualizando estado:", error);
      alert("No se pudo actualizar el estado.");
    }
  };

  // Función para borrar un pedido de la nube
  const deleteOrder = async (orderId) => {
    if(window.confirm('¿Estás seguro de borrar este pedido permanentemente?')) {
      try {
        await deleteDoc(doc(db, "orders", orderId));
      } catch (error) {
        console.error("Error borrando pedido:", error);
        alert("No se pudo borrar el pedido.");
      }
    }
  };

  return (
    <div className="admin-page" style={{ minHeight: '100vh', backgroundColor: '#1a1a1a', color: 'white', paddingBottom: '50px' }}>
      <Header />
      
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #444', paddingBottom: '15px' }}>
          <h2 style={{ color: '#FFC404', margin: 0 }}>Pedidos en Vivo 🔴</h2>
          <button 
            onClick={() => onNavigate('home')} 
            style={{ background: '#333', color: 'white', border: '1px solid #fff', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Salir
          </button>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center' }}>Cargando pedidos...</p>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#888', marginTop: '50px' }}>
            <h3>No hay pedidos activos.</h3>
            <p>Los pedidos que realices aparecerán aquí automáticamente.</p>
          </div>
        ) : (
          <div className="orders-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.map(order => (
              <div key={order.id} style={{ backgroundColor: '#242424', padding: '20px', borderRadius: '8px', border: `2px solid ${order.status === 'Pendiente' ? '#FFC404' : '#444'}` }}>
                
                {/* Cabecera del Pedido */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid #444', paddingBottom: '10px' }}>
                  <div>
                    <span style={{ color: '#FFC404', fontWeight: 'bold', fontSize: '1.1rem' }}>
                      Cliente: {order.customer?.nombre || "Anónimo"}
                    </span>
                    <div style={{ fontSize: '0.8rem', color: '#aaa' }}>{order.date}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>${order.total}</span>
                    <div style={{ fontSize: '0.8rem', color: '#ccc' }}>
                      {order.paymentMethod ? order.paymentMethod.toUpperCase() : 'ND'}
                    </div>
                  </div>
                </div>

                {/* Datos de Contacto */}
                <div style={{ marginBottom: '15px', color: '#ddd' }}>
                  <p style={{margin:'2px'}}>📞 {order.customer?.telefono}</p>
                  <p style={{margin:'2px'}}>📍 {order.customer?.direccion}</p>
                  {order.customer?.comentarios && <p style={{margin:'2px', color:'#FFC404', fontStyle:'italic'}}>💬 "{order.customer.comentarios}"</p>}
                </div>

                {/* Lista de Productos */}
                <div style={{ backgroundColor: '#1a1a1a', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>
                  {order.items && order.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '5px', borderBottom: '1px dashed #333', paddingBottom: '2px' }}>
                      <span><b style={{color:'#FFC404'}}>{item.quantity}x</b> {item.name}</span>
                      <span>${item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Acciones (Estado y Borrar) */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <select 
                    value={order.status} 
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    style={{ padding: '8px', borderRadius: '4px', backgroundColor: '#333', color: 'white', border: '1px solid #555', cursor: 'pointer' }}
                  >
                    <option value="Pendiente">🟡 Pendiente</option>
                    <option value="En Preparación">🟠 En Preparación</option>
                    <option value="En Camino">🚚 En Camino</option>
                    <option value="Entregado">✅ Entregado</option>
                  </select>
                  
                  <button 
                    onClick={() => deleteOrder(order.id)}
                    style={{ color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem' }}
                  >
                    Borrar
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;