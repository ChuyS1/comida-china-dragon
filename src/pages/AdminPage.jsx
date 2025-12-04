// src/pages/AdminPage.jsx

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
// Importamos la base de datos y las funciones de Firebase
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const AdminPage = ({ onNavigate }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 1. NUEVO ESTADO: Para saber en qué pestaña estamos ('activos' o 'historial')
  const [currentTab, setCurrentTab] = useState('activos');

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id, 
        ...doc.data()
      }));
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      console.error("Error obteniendo pedidos:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
    } catch (error) {
      console.error("Error actualizando estado:", error);
      alert("No se pudo actualizar el estado.");
    }
  };

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

  // 2. FILTROS INTELIGENTES
  // Separamos los pedidos en dos listas automáticamente
  const activeOrders = orders.filter(order => order.status !== 'Entregado');
  const historyOrders = orders.filter(order => order.status === 'Entregado');

  // Decidimos cuál lista mostrar según la pestaña seleccionada
  const displayedOrders = currentTab === 'activos' ? activeOrders : historyOrders;

  return (
    <div className="admin-page" style={{ minHeight: '100vh', backgroundColor: '#1a1a1a', color: 'white', paddingBottom: '50px' }}>
      <Header />
      
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Encabezado y Botón Salir */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #444', paddingBottom: '15px' }}>
          <h2 style={{ color: '#FFC404', margin: 0 }}>Panel de Control 👨‍🍳</h2>
          <button 
            onClick={() => onNavigate('home')} 
            style={{ background: '#333', color: 'white', border: '1px solid #fff', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Salir
          </button>
        </div>

        {/* 3. BOTONES DE PESTAÑAS */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
          <button 
            onClick={() => setCurrentTab('activos')}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: currentTab === 'activos' ? '#FFC404' : '#333',
              color: currentTab === 'activos' ? 'black' : 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            EN CURSO ({activeOrders.length})
          </button>

          <button 
            onClick={() => setCurrentTab('historial')}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: currentTab === 'historial' ? '#FFC404' : '#333',
              color: currentTab === 'historial' ? 'black' : 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            HISTORIAL ({historyOrders.length})
          </button>
        </div>

        {/* Lista de Pedidos */}
        {loading ? (
          <p style={{ textAlign: 'center' }}>Cargando pedidos...</p>
        ) : displayedOrders.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#888', marginTop: '50px' }}>
            <h3>
              {currentTab === 'activos' 
                ? "¡Todo limpio! No hay pedidos pendientes." 
                : "No hay historial de pedidos entregados aún."}
            </h3>
          </div>
        ) : (
          <div className="orders-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {displayedOrders.map(order => (
              <div key={order.id} style={{ 
                backgroundColor: '#242424', 
                padding: '20px', 
                borderRadius: '8px', 
                // Borde dorado si está pendiente, gris si es historial
                border: `2px solid ${currentTab === 'activos' ? '#FFC404' : '#555'}`,
                opacity: currentTab === 'historial' ? 0.8 : 1 // Un poco más opaco si es historial
              }}>
                
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

                {/* Acciones */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <select 
                    value={order.status || 'Pendiente'} 
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    style={{ padding: '8px', borderRadius: '4px', backgroundColor: '#333', color: 'white', border: '1px solid #555', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    <option value="Pendiente">🟡 Pendiente</option>
                    <option value="En Preparación">🟠 En Preparación</option>
                    <option value="En Camino">🚚 En Camino</option>
                    <option value="Entregado">✅ Entregado (Archivar)</option>
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