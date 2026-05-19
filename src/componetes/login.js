import React, { useState } from 'react';

function Login({ onLoginSuccess }) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Lee la IP del .env o usa tu IP de Ubuntu actual de respaldo
    const API_URL = process.env.REACT_APP_API_URL || 'http://192.168.1.21:5000';

    try {
      console.log(`➡️ Conectando a backend en: ${API_URL}/api/login`);
      
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ correo, contrasena })
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Autenticación exitosa', data);
        if (onLoginSuccess) {
          onLoginSuccess(data);
        } else {
          alert(`¡Bienvenido de vuelta, ${data.nombre}!`);
        }
      } else {
        setError(data.message || 'Datos de consola inválidos (Correo o clave incorrectos).');
      }
    } catch (err) {
      console.error('❌ Error de red:', err);
      setError('Error de enlace de red. El servidor está caído o la IP cambió.');
    }
  };

  return (
    <div style={{ background: '#0a1128', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#0f1c3f', padding: '40px', borderRadius: '12px', width: '360px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', textAlign: 'center' }}>
        <h3 style={{ color: '#00b4d8', marginBottom: '20px', letterSpacing: '1px' }}>FASTECH CORE ACCESO</h3>
        
        {error && (
          <div style={{ background: 'rgba(255, 75, 75, 0.15)', border: '1px solid #ff4b4b', color: '#ff4b4b', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '14px' }}>
            × {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <input 
            type="text" 
            placeholder="Nombre de usuario o Correo" 
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '6px', border: 'none', background: '#e8f0fe', color: '#000', boxSizing: 'border-box' }}
          />
          <input 
            type="password" 
            placeholder="••••" 
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            style={{ width: '100%', padding: '12px', marginBottom: '25px', borderRadius: '6px', border: 'none', background: '#e8f0fe', color: '#0 black', boxSizing: 'border-box' }}
          />
          <button type="submit" style={{ width: '100%', padding: '12px', background: '#0096c7', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
            Autenticar Perfil
          </button>
        </form>
        
        <div style={{ marginTop: '20px' }}>
          <a href="#registro" style={{ color: '#00b4d8', fontSize: '14px', textDecoration: 'underline' }}>¿No tienes cuenta? Regístrate aquí</a>
        </div>
      </div>
    </div>
  );
}

export default Login;