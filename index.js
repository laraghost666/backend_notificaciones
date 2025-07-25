const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Conexión a MySQL (SparkedHost)
const db = mysql.createConnection({
  host: 'db-buf-03.sparkedhost.us',
  user: 'u181458_F6wWqVn52c',
  password: 'YgkD+JaMLA@7IE79AR!QlUi!',
  database: 's181458_notificacion', // Cambia por el nombre de tu DB
  port: 3306
});

db.connect((err) => {
  if (err) throw err;
  console.log('Conectado a MySQL en SparkedHost');
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API funcionando');
});

// CRUD básico para "usuarios"
app.get('/usuarios', (req, res) => {
  db.query('SELECT * FROM services', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// app.post('/usuarios', (req, res) => {
//   const { nombre, edad } = req.body;
//   db.query('INSERT INTO usuarios (nombre, edad) VALUES (?, ?)', [nombre, edad], (err, result) => {
//     if (err) throw err;
//     res.json({ message: 'Usuario agregado', id: result.insertId });
//   });
// });

// app.delete('/usuarios/:id', (req, res) => {
//   const { id } = req.params;
//   db.query('DELETE FROM usuarios WHERE id = ?', [id], (err) => {
//     if (err) throw err;
//     res.json({ message: 'Usuario eliminado' });
//   });
// });

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
