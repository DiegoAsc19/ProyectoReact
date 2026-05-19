// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. CONFIGURACIÓN DE CONEXIÓN A LA BASE DE DATOS
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',       
  password: 'piglet19', // <-- Agrega aquí tu contraseña de MariaDB si usas una
  database: 'fastech_db'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Error conectando a la base de datos fastech_db:', err.message);
    return;
  }
  console.log('⚡ Conectado con éxito a MySQL/MariaDB en fastech_db');
});

// ==========================================
// 2. RUTAS DE AUTENTICACIÓN Y USUARIOS
// ==========================================
app.post('/api/login', (req, res) => {
  console.log("➡️ Petición de Login recibida:", req.body);
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }

  const query = `
    SELECT id_usuario AS id, nombre, rol 
    FROM usuarios 
    WHERE (nombre = ? OR correo = ?) AND contrasena = ?
  `;
  
  db.query(query, [correo, correo, contrasena], (err, results) => {
    if (err) {
      console.error("❌ Error SQL en login:", err.message);
      return res.status(500).json({ error: err.message });
    }
    
    if (results.length > 0) {
      console.log(`✅ Login exitoso para el usuario: ${results[0].nombre}`);
      res.json(results[0]);
    } else {
      console.log(`⚠️ Credenciales rechazadas para: "${correo}"`);
      res.status(401).json({ message: 'Credenciales incorrectas' });
    }
  });
});

app.post('/api/usuarios', (req, res) => {
  console.log("➡️ Petición de Registro recibida:", req.body);
  const { nombre, correo, contrasena, rol } = req.body;
  
  const rolUsuario = rol || 'cliente';

  if (!nombre || !correo || !contrasena) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  const query = 'INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES (?, ?, ?, ?)';
  
  db.query(query, [nombre, correo, contrasena, rolUsuario], (err, result) => {
    if (err) {
      console.error("❌ Error SQL en registro:", err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log(`👤 Nuevo usuario registrado con ID: ${result.insertId}`);
    res.json({ message: 'Usuario registrado con éxito', id: result.insertId });
  });
});

// ==========================================
// 3. RUTAS DEL CATÁLOGO DE PRODUCTOS
// ==========================================
app.get('/productos', (req, res) => {
  const query = 'SELECT id_producto, nombre, descripcion, precio, stock, imagen_url FROM productos';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ==========================================
// 4. RUTAS DEL CARRITO DE COMPRAS
// ==========================================
app.get('/api/carrito/:id_usuario', (req, res) => {
  const { id_usuario } = req.params;
  const query = `
    SELECT c.id_producto, p.nombre, p.precio, c.cantidad 
    FROM carrito c
    JOIN productos p ON c.id_producto = p.id_producto
    WHERE c.id_usuario = ?
  `;
  db.query(query, [id_usuario], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/carrito', (req, res) => {
  const { id_usuario, id_producto, cantidad } = req.body;
  const checkQuery = 'SELECT cantidad FROM carrito WHERE id_usuario = ? AND id_producto = ?';
  
  db.query(checkQuery, [id_usuario, id_producto], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (results.length > 0) {
      const nuevaCantidad = results[0].cantidad + cantidad;
      const updateQuery = 'UPDATE carrito SET cantidad = ? WHERE id_usuario = ? AND id_producto = ?';
      db.query(updateQuery, [nuevaCantidad, id_usuario, id_producto], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Cantidad actualizada en el carrito' });
      });
    } else {
      const insertQuery = 'INSERT INTO carrito (id_usuario, id_producto, cantidad) VALUES (?, ?, ?)';
      db.query(insertQuery, [id_usuario, id_producto, cantidad], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Producto añadido al carrito con éxito' });
      });
    }
  });
});

app.delete('/api/carrito/:id_usuario/:id_producto', (req, res) => {
  const { id_usuario, id_producto } = req.params;
  const query = 'DELETE FROM carrito WHERE id_usuario = ? AND id_producto = ?';
  db.query(query, [id_usuario, id_producto], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Artículo removido del carrito' });
  });
});

// ==========================================
// 5. PROCESAMIENTO DE COMPRAS (CHECKOUT)
// ==========================================
app.post('/api/carrito/comprar', (req, res) => {
  const { id_usuario } = req.body;
  const queryCarrito = `
    SELECT c.id_producto, c.cantidad, p.precio, p.stock 
    FROM carrito c
    JOIN productos p ON c.id_producto = p.id_producto
    WHERE c.id_usuario = ?
  `;

  db.query(queryCarrito, [id_usuario], (err, items) => {
    if (err) return res.status(500).json({ error: err.message });
    if (items.length === 0) return res.status(400).json({ message: 'El carrito está vacío' });

    db.beginTransaction((errTx) => {
      if (errTx) return res.status(500).json({ error: errTx.message });

      try {
        let completados = 0;
        items.forEach((item) => {
          if (item.stock < item.cantidad) {
            return db.rollback(() => {
              res.status(400).json({ message: `Stock insuficiente para producto ID: ${item.id_producto}` });
            });
          }

          const queryUpdateStock = 'UPDATE productos SET stock = stock - ? WHERE id_producto = ?';
          db.query(queryUpdateStock, [item.cantidad, item.id_producto], (errUp) => {
            if (errUp) return db.rollback(() => { res.status(500).json({ error: errUp.message }); });

            const queryHistorial = 'INSERT INTO historial_compras (id_usuario, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)';
            db.query(queryHistorial, [id_usuario, item.id_producto, item.cantidad, item.precio], (errHist) => {
              if (errHist) return db.rollback(() => { res.status(500).json({ error: errHist.message }); });

              completados++;
              if (completados === items.length) {
                db.query('DELETE FROM carrito WHERE id_usuario = ?', [id_usuario], (errDel) => {
                  if (errDel) return db.rollback(() => { res.status(500).json({ error: errDel.message }); });

                  db.commit((errCommit) => {
                    if (errCommit) return db.rollback(() => { res.status(500).json({ error: errCommit.message }); });
                    res.json({ message: 'Transacción completada con éxito' });
                  });
                });
              }
            });
          });
        });
      } catch (error) {
        db.rollback(() => { res.status(500).json({ error: error.message }); });
      }
    });
  });
});

// ==========================================
// 6. RUTA DEL HISTORIAL DE COMPRAS
// ==========================================
app.get('/api/compras/:id_usuario', (req, res) => {
  const { id_usuario } = req.params;
  const query = `
    SELECT p.nombre AS nombre_producto, h.cantidad, h.precio_unitario, h.fecha 
    FROM historial_compras h
    JOIN productos p ON h.id_producto = p.id_producto
    WHERE h.id_usuario = ?
    ORDER BY h.fecha DESC
  `;
  db.query(query, [id_usuario], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 7. ARRANQUE GLOBAL
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en: http://192.168.1.30:${PORT}`);
});