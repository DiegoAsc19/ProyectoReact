// src/componetes/cliente.js
import React, { useState, useEffect } from 'react';
import styles from '../AppStyles'; 

export default function Cliente({ usuario, onLogout }) {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [comprasHistorial, setComprasHistorial] = useState([]);
  const [subVista, setSubVista] = useState('catalogo'); // Valores: 'catalogo', 'carrito' o 'perfil'
  
  // Estado para controlar el modal de detalles
  const [productoDetalle, setProductoDetalle] = useState(null);

  const cargarCatalogo = () => {
    fetch('http://localhost:5000/productos')
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(() => setProductos([]));
  };

  const cargarCarrito = () => {
    fetch(`http://localhost:5000/api/carrito/${usuario.id}`)
      .then(res => res.json())
      .then(data => setCarrito(data))
      .catch(() => setCarrito([]));
  };

  const cargarHistorialCompras = () => {
    fetch(`http://localhost:5000/api/compras/${usuario.id}`)
      .then(res => res.json())
      .then(data => setComprasHistorial(data))
      .catch(() => setComprasHistorial([]));
  };

  useEffect(() => {
    cargarCatalogo();
    cargarCarrito();
    cargarHistorialCompras();
  }, []);

  const agregarAlCarrito = (id_producto) => {
    fetch('http://localhost:5000/api/carrito', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_usuario: usuario.id, id_producto, cantidad: 1 })
    }).then(res => {
      if (res.ok) {
        alert("Componente añadido al carrito.");
        cargarCarrito();
      }
    });
  };

  const eliminarDelCarrito = (id_producto) => {
    if (!id_producto) {
      alert("Error: El ID del producto no está definido.");
      return;
    }

    if (window.confirm("¿Remover este artículo de tu carrito de compras?")) {
      fetch(`http://localhost:5000/api/carrito/${usuario.id}/${id_producto}`, {
        method: 'DELETE'
      })
      .then(res => {
        if (res.ok) {
          alert("Artículo eliminado del carrito.");
          cargarCarrito(); 
        } else {
          alert("El servidor reportó que el artículo no se pudo eliminar.");
        }
      })
      .catch(() => alert("Error de comunicación con el servidor."));
    }
  };

  const ejecutarCompra = () => {
    if (carrito.length === 0) return alert("El carrito está vacío.");
    
    if (window.confirm("¿Confirmar pedido? Se descontará el stock de fastech_db.")) {
      
      // Enviamos la petición directamente sin alterar el estado local antes de tiempo
      fetch('http://localhost:5000/api/carrito/comprar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario: usuario.id })
      })
      .then(res => {
        if (res.ok) {
          // SOLUCIÓN CRUCIAL: Primero cambiamos la vista a perfil para desmontar la tabla del carrito
          setSubVista('perfil'); 
          
          // Una vez fuera de la vista carrito, limpiamos el estado local de manera segura
          setCarrito([]); 
          
          // Pedimos las actualizaciones correspondientes a la base de datos
          cargarCatalogo();
          cargarHistorialCompras(); 
          
          alert("Compra realizada con éxito. Inventario actualizado.");
        } else {
          alert("Hubo un problema al procesar la transacción en el servidor.");
        }
      })
      .catch(() => {
        alert("Error de comunicación con el servidor al procesar la compra.");
      });
    }
  };

  const totalPagar = carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);

  return (
    <div style={styles.appContainer}>
      {/* INYECCIÓN NATIVA DE ANIMACIONES Y CLASES DE ESTILO DE FASTECH */}
      <style>{`
        .robot-container { position: fixed; bottom: 25px; right: 25px; display: flex; flex-direction: column; align-items: flex-end; gap: 12px; z-index: 9999; font-family: sans-serif; }
        .robot-bubble { background: linear-gradient(135deg, #0ea5e9, #0284c7); color: #fff; padding: 12px 16px; border-radius: 16px 16px 4px 16px; font-size: 13px; max-width: 210px; line-height: 1.4; box-shadow: 0 4px 15px rgba(14, 165, 233, 0.25); border: 1px solid rgba(255,255,255,0.1); animation: bubblePulse 4s ease-in-out infinite; }
        .robot-avatar { width: 65px; height: 70px; display: flex; flex-direction: column; align-items: center; cursor: pointer; animation: robotFloatGlobal 3s ease-in-out infinite; transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .robot-avatar:hover { transform: scale(1.15) rotate(360deg); }
        .robot-antenna { width: 4px; height: 8px; background-color: #06b6d4; position: relative; }
        .robot-antenna::before { content: ''; position: absolute; top: -5px; left: -3px; width: 10px; height: 10px; background-color: #22d3ee; border-radius: 50%; box-shadow: 0 0 10px #22d3ee; animation: glowLaser 1.5s ease-in-out infinite alternate; }
        .robot-head { width: 52px; height: 38px; background-color: #111936; border: 2px solid #06b6d4; border-radius: 12px; display: flex; justify-content: center; align-items: center; box-shadow: 0 0 12px rgba(6, 182, 212, 0.4); }
        .robot-eyes { display: flex; gap: 10px; }
        .robot-eye { width: 10px; height: 10px; background-color: #22d3ee; border-radius: 50%; box-shadow: 0 0 8px #22d3ee; animation: robotBlink 4s infinite; }
        .robot-body-part { width: 36px; height: 20px; background-color: #1e293b; border: 2px solid #334155; border-top: none; border-radius: 0 0 10px 10px; display: flex; justify-content: center; align-items: center; }
        .robot-core { width: 12px; height: 6px; background-color: #e11d48; border-radius: 4px; box-shadow: 0 0 6px #e11d48; animation: corePulse 1s infinite alternate; }

        /* ESTILOS INTERNOS PARA EL MODAL DE DETALLES */
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(2, 6, 23, 0.75); display: flex; justify-content: center; align-items: center; z-index: 10000; backdrop-filter: blur(4px); }
        .modal-body { background: #0b112c; border: 2px solid #06b6d4; border-radius: 16px; padding: 25px; width: 450px; max-width: 90%; box-shadow: 0 0 25px rgba(6, 182, 212, 0.3); font-family: sans-serif; position: relative; animation: modalFadeIn 0.3s ease-out; }
        .modal-close { position: absolute; top: 15px; right: 15px; background: none; border: none; color: #64748b; font-size: 20px; cursor: pointer; transition: color 0.2s; }
        .modal-close:hover { color: #f87171; }
        .detail-label { color: #06b6d4; font-size: 12px; font-weight: bold; margin-top: 15px; display: block; letter-spacing: 1px; }
        .detail-text { color: #e2e8f0; font-size: 14px; margin: 5px 0 0 0; line-height: 1.5; background: #111936; padding: 10px; border-radius: 8px; border: 1px solid #1e293b; }

        /* ESTILOS DE LA SECCIÓN DE PERFIL */
        .profile-badge { display: inline-block; padding: 4px 12px; background: rgba(6, 182, 212, 0.15); border: 1px solid #06b6d4; color: #22d3ee; border-radius: 20px; font-size: 12px; font-weight: bold; margin-top: 5px; }
        .history-card { background: #111936; border: 1px solid #1e293b; border-radius: 10px; padding: 15px; margin-bottom: 12px; transition: border-color 0.2s; }
        .history-card:hover { border-color: #0ea5e9; }

        @keyframes modalFadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes robotFloatGlobal { 0% { transform: translateY(0px); } 50% { transform: translateY(-12px); } 100% { transform: translateY(0px); } }
        @keyframes bubblePulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.03); } }
        @keyframes robotBlink { 0%, 45%, 55%, 100% { transform: scaleY(1); } 50% { transform: scaleY(0.1); } }
        @keyframes glowLaser { from { filter: drop-shadow(0 0 2px #22d3ee); opacity: 0.7; } to { filter: drop-shadow(0 0 12px #22d3ee); opacity: 1; } }
        @keyframes corePulse { from { opacity: 0.4; } to { opacity: 1; filter: brightness(1.2); } }
      `}</style>

      {/* MENÚ LATERAL (SIDEBAR) */}
      <nav style={styles.sidebar}>
        <h3 style={styles.menuTitle}>FASTECH STORE</h3>
        <p style={{ color: '#0ea5e9', textAlign: 'center', margin: '-20px 0 20px 0', fontSize: '12px' }}>Bienvenido, {usuario.nombre}</p>
        
        <button onClick={() => setSubVista('catalogo')} style={{...styles.menuBtn, backgroundColor: subVista === 'catalogo' ? '#0ea5e9' : 'transparent', color: '#fff'}}> Ver Catalogo</button>
        <button onClick={() => { setSubVista('carrito'); cargarCarrito(); }} style={{...styles.menuBtn, backgroundColor: subVista === 'carrito' ? '#0ea5e9' : 'transparent', color: '#fff'}}> Mi Carrito ({carrito.length})</button>
        <button onClick={() => { setSubVista('perfil'); cargarHistorialCompras(); }} style={{...styles.menuBtn, backgroundColor: subVista === 'perfil' ? '#0ea5e9' : 'transparent', color: '#fff'}}> Mi Perfil</button>
        
        <button onClick={onLogout} style={{ ...styles.menuBtn, marginTop: 'auto', backgroundColor: '#334155', color: '#fff' }}> Salir</button>
      </nav>

      {/* ÁREA DE CONTENIDO DINÁMICO */}
      <main style={styles.mainContent}>
        
        {/* VISTA 1: CATÁLOGO DE COMPONENTES */}
        {subVista === 'catalogo' && (
          <div>
            <h2 style={{color: '#06b6d4', marginBottom: '20px'}}>Componentes de Hardware Disponibles</h2>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '20px'}}>
              {productos.map(p => (
                <div key={p.id_producto} style={{...styles.card, width: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                  <img 
                    src={p.imagen_url ? p.imagen_url : 'https://placehold.co/200x150/111936/38bdf8?text=Hardware'} 
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/200x150/111936/38bdf8?text=Hardware'; }}
                    style={{width: '100%', height: '140px', objectFit: 'cover', borderRadius: '10px'}} alt="" 
                  />
                  <h4 style={{color: '#fff', margin: '10px 0 5px 0'}}>{p.nombre}</h4>
                  <p style={{color: '#64748b', fontSize: '12px', flexGrow: 1, height: '40px', overflow: 'hidden'}}>{p.descripcion}</p>
                  <p style={{color: '#06b6d4', fontWeight: 'bold', fontSize: '18px', margin: '5px 0'}}>Total: ${parseFloat(p.precio).toFixed(2)}</p>
                  <p style={{color: p.stock > 0 ? '#4ade80' : '#f87171', fontSize: '12px', marginBottom: '10px'}}>Disponibles: {p.stock} uds.</p>
                  
                  <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                    <button 
                      onClick={() => setProductoDetalle(p)} 
                      style={{ ...styles.btn, backgroundColor: '#334155', flex: 1, fontSize: '13px', padding: '10px' }}
                    >
                      Detalles
                    </button>
                    <button 
                      onClick={() => agregarAlCarrito(p.id_producto)} 
                      disabled={p.stock <= 0}
                      style={{...styles.btn, backgroundColor: p.stock > 0 ? '#0ea5e9' : '#1e293b', flex: 1, fontSize: '13px', padding: '10px', cursor: p.stock > 0 ? 'pointer' : 'not-allowed'}}
                    >
                      {p.stock > 0 ? 'Añadir' : 'Agotado'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VISTA 2: CARRITO DE COMPRAS */}
        {subVista === 'carrito' && (
          <div style={styles.cardWide}>
            <h2 style={{color: '#06b6d4'}}>Tu Carrito de Compras</h2>
            <table style={{...styles.table, width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr>
                  <th style={styles.th}>Producto</th>
                  <th style={styles.th}>Precio Unitario</th>
                  <th style={styles.th}>Cantidad</th>
                  <th style={styles.th}>Subtotal</th>
                  <th style={{...styles.th, textAlign: 'center'}}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {carrito.map(item => (
                  <tr key={item.id_producto} style={styles.tr}>
                    <td style={styles.td}><strong>{item.nombre}</strong></td>
                    <td style={styles.td}>${parseFloat(item.precio).toFixed(2)}</td>
                    <td style={styles.td}>{item.cantidad}</td>
                    <td style={styles.td}>${(item.precio * item.cantidad).toFixed(2)}</td>
                    <td style={{...styles.td, textAlign: 'center', verticalAlign: 'middle'}}>
                      <button 
                        onClick={() => eliminarDelCarrito(item.id_producto)}
                        style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div style={{marginTop: '30px', textAlign: 'right', borderTop: '2px solid #1e293b', paddingTop: '20px'}}>
              <h3 style={{color: '#fff', marginBottom: '15px'}}>Total Final: ${totalPagar.toFixed(2)}</h3>
              <button onClick={ejecutarCompra} style={{backgroundColor: '#22c55e', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'}}>
                Procesar Compra Total
              </button>
            </div>
          </div>
        )}

        {/* VISTA 3: MI PERFIL Y HISTORIAL DE COMPRAS */}
        {subVista === 'perfil' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Tarjeta Informativa de Cuenta */}
            <div style={styles.cardWide}>
              <h2 style={{ color: '#06b6d4', marginTop: 0 }}>Mi Perfil de Usuario</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '15px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#111936', border: '2px solid #0ea5e9', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px' }}>
                  👤
                </div>
                <div>
                  <h3 style={{ color: '#fff', margin: 0 }}>{usuario.nombre}</h3>
                  <p style={{ color: '#64748b', margin: '3px 0' }}>Identificador único de cuenta: #{usuario.id}</p>
                  <span className="profile-badge">Rango: Cliente Autenticado</span>
                </div>
              </div>
            </div>

            {/* Listado del Historial de Transacciones */}
            <div style={styles.cardWide}>
              <h3 style={{ color: '#06b6d4', marginTop: 0, marginBottom: '20px' }}>Historial de Adquisiciones de Hardware</h3>
              
              {comprasHistorial.length === 0 ? (
                <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>
                  Aún no has realizado ninguna transacción en la plataforma. ¡Tu historial aparecerá aquí!
                </p>
              ) : (
                <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '5px' }}>
                  {comprasHistorial.map((compra, index) => (
                    <div key={index} className="history-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ color: '#0ea5e9', fontWeight: 'bold', fontSize: '15px' }}>
                          📦 {compra.nombre_producto}
                        </span>
                        <span style={{ color: '#64748b', fontSize: '12px' }}>
                          {compra.fecha ? new Date(compra.fecha).toLocaleDateString() : 'Reciente'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                        <span style={{ color: '#e2e8f0' }}>Cantidad: {compra.cantidad} unidad(es)</span>
                        <span style={{ color: '#4ade80', fontWeight: 'bold' }}>
                          Total Pagado: ${(compra.precio_unitario * compra.cantidad).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* --- MODAL ESTILIZADO DE DETALLES --- */}
      {productoDetalle && (
        <div className="modal-overlay" onClick={() => setProductoDetalle(null)}>
          <div className="modal-body" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setProductoDetalle(null)}>✕</button>
            <h3 style={{ color: '#06b6d4', marginTop: 0, borderBottom: '1px solid #1e293b', paddingBottom: '10px' }}>
              ESPECIFICACIONES DE HARDWARE
            </h3>
            <span className="detail-label">MODELO COMERCIAL</span>
            <p style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold', margin: '5px 0' }}>
              {productoDetalle.nombre}
            </p>
            <span className="detail-label">DESCRIPCIÓN DEL DISPOSITIVO</span>
            <p className="detail-text">{productoDetalle.descripcion || 'Sin descripción registrada.'}</p>
            <span className="detail-label">ESPECIFICACIONES TÉCNICAS</span>
            <p className="detail-text" style={{ borderColor: '#0ea5e9' }}>
              {productoDetalle.especificaciones || 'Ninguna especificación técnica añadida.'}
            </p>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#4ade80', fontSize: '14px' }}>Disponibles: {productoDetalle.stock} uds.</span>
              <span style={{ color: '#06b6d4', fontSize: '20px', fontWeight: 'bold' }}>${parseFloat(productoDetalle.precio).toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* --- ASISTENTE ROBOT EN ESQUINA --- */}
      <div className="robot-container">
        <div className="robot-bubble">
          ¡Hola {usuario.nombre}! FasTech Bot está listo para procesar tu hardware. 🌐⚡
        </div>
        <div className="robot-avatar">
          <div className="robot-antenna"></div>
          <div className="robot-head">
            <div className="robot-eyes">
              <div className="robot-eye left"></div>
              <div className="robot-eye right"></div>
            </div>
          </div>
          <div className="robot-body-part">
            <div className="robot-core"></div>
          </div>
        </div>
      </div>
    </div>
  );
}