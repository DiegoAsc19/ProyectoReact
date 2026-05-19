// src/App.js
import React, { useState, useEffect } from 'react';
import styles from './AppStyles';
import login from './componetes/login';       
import cliente from './componetes/cliente';   

const ComponenteLogin = login;
const ComponenteCliente = cliente;

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [productos, setProductos] = useState([]);
  const [vistaActual, setVistaActual] = useState('inventario');

  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [especificaciones, setEspecificaciones] = useState('');
  const [error, setError] = useState('');

  const obtenerProductos = () => {
    fetch('http://localhost:5000/productos')
      .then(res => res.json())
      .then(data => setProductos(Array.isArray(data) ? data : []))
      .catch(() => setProductos([]));
  };

  useEffect(() => {
    if (usuario && usuario.rol === 'admin') obtenerProductos();
  }, [usuario]);

  const guardarProducto = (e) => {
    e.preventDefault();
    if (!nombre.trim() || !precio.trim() || !stock.trim()) {
      setError('❌ Nombre, Precio y Stock son requeridos.');
      return;
    }
    setError('');

    fetch('http://localhost:5000/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, precio: parseFloat(precio), stock: parseInt(stock), descripcion, imagen_url: imagenUrl, especificaciones })
    }).then(res => {
      if (res.ok) {
        obtenerProductos();
        setNombre(''); setPrecio(''); setStock(''); setDescripcion(''); setImagenUrl(''); setEspecificaciones('');
        setVistaActual('registrados');
      } else {
        alert('❌ Error interno del servidor al guardar producto.');
      }
    });
  };

  const eliminarProducto = (id) => {
    if (!id) return;
    if (window.confirm('¿Remover este componente de MySQL? (Se limpiará también del carrito)')) {
      fetch(`http://localhost:5000/productos/${id}`, { method: 'DELETE' })
        .then(res => {
          if (res.ok) obtenerProductos();
          else alert("❌ No se pudo eliminar de la base de datos.");
        })
        .catch(() => alert("❌ Error de comunicación con el servidor."));
    }
  };

  if (!usuario) return <ComponenteLogin onLoginSuccess={(u) => setUsuario(u)} />;
  if (usuario.rol === 'cliente') return <ComponenteCliente usuario={usuario} onLogout={() => setUsuario(null)} />;

  return (
    <div style={styles.appContainer}>
      <nav style={styles.sidebar}>
        <h3 style={styles.menuTitle}>FASTECH ADMIN</h3>
        <p style={{ color: '#e74c3c', textAlign: 'center', margin: '-20px 0 20px 0', fontSize: '12px', fontWeight: 'bold' }}>⚡ CONSOLA DE MANDO</p>
        <button onClick={() => setVistaActual('inventario')} style={{...styles.menuBtn, backgroundColor: vistaActual === 'inventario' ? '#0ea5e9' : 'transparent', color: '#fff'}}>📦 Inyectar Hardware</button>
        <button onClick={() => setVistaActual('registrados')} style={{...styles.menuBtn, backgroundColor: vistaActual === 'registrados' ? '#0ea5e9' : 'transparent', color: '#fff'}}>📋 Inventario Activo</button>
        <button onClick={() => setVistaActual('eliminar')} style={{...styles.menuBtn, backgroundColor: vistaActual === 'eliminar' ? '#e74c3c' : 'transparent', color: '#fff'}}>🗑️ Eliminar Unidad</button>
        <button onClick={() => setUsuario(null)} style={{ ...styles.menuBtn, marginTop: 'auto', backgroundColor: '#334155', color: '#fff' }}>🔒 Cerrar Consola</button>
      </nav>

      <main style={styles.mainContent}>
        {vistaActual === 'inventario' && (
          <div style={{...styles.card, maxWidth: '540px'}}>
            <h2 style={{ color: '#06b6d4', textAlign: 'center', marginBottom: '20px' }}>Carga de Dispositivos</h2>
            {error && <div style={styles.errorBanner}>{error}</div>}
            <form onSubmit={guardarProducto} style={styles.form}>
              <input type="text" placeholder="Nombre Comercial" value={nombre} onChange={(e) => setNombre(e.target.value)} style={styles.input} />
              <div style={{display: 'flex', gap: '15px'}}>
                <input type="number" placeholder="Precio ($)" value={precio} onChange={(e) => setPrecio(e.target.value)} style={{...styles.input, flex: 1}} />
                <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} style={{...styles.input, flex: 1}} />
              </div>
              <input type="text" placeholder="URL de la Imagen" value={imagenUrl} onChange={(e) => setImagenUrl(e.target.value)} style={styles.input} />
              <textarea placeholder="Descripción..." value={descripcion} onChange={(e) => setDescripcion(e.target.value)} style={{...styles.input, height: '70px', resize: 'none'}} />
              <input type="text" placeholder="Especificaciones (RAM, SSD, CPU)" value={especificaciones} onChange={(e) => setEspecificaciones(e.target.value)} style={styles.input} />
              <button type="submit" style={styles.btn}>Guardar en fastech_db</button>
            </form>
          </div>
        )}

        {(vistaActual === 'registrados' || vistaActual === 'eliminar') && (
          <div style={styles.cardWide}>
            <h2 style={{color: '#06b6d4', marginTop: 0}}>{vistaActual === 'registrados' ? '📋 Base de Datos de Dispositivos' : '🗑️ Depuración de Hardware'}</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Imagen</th>
                  <th style={styles.th}>Modelo</th>
                  <th style={styles.th}>Costo</th>
                  <th style={styles.th}>Disponibles</th>
                  {vistaActual === 'eliminar' && <th style={styles.th}>Acción</th>}
                </tr>
              </thead>
              <tbody>
                {productos.map(p => (
                  <tr key={p.id || p.id_producto} style={styles.tr}>
                    <td style={styles.td}>
                      <img 
                        src={p.imagen_url ? p.imagen_url : 'https://placehold.co/50x45/111936/38bdf8?text=HW'} 
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/50x45/111936/38bdf8?text=HW'; }}
                        width="50" height="45" style={{objectFit: 'cover', borderRadius: '6px'}} alt="" 
                      />
                    </td>
                    <td style={styles.td}>
                      <strong>{p.nombre}</strong><br/><small style={{color: '#64748b'}}>{p.especificaciones}</small>
                    </td>
                    <td style={styles.td}>${parseFloat(p.precio).toFixed(2)}</td>
                    <td style={styles.td}>{p.stock} uds.</td>
                    {vistaActual === 'eliminar' && (
                      <td style={styles.td}>
                        <button onClick={() => eliminarProducto(p.id || p.id_producto)} style={{...styles.btn, backgroundColor: '#e74c3c', padding: '6px 12px', width: 'auto'}}>Eliminar</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}