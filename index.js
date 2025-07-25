const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads')); // para servir imágenes



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nombreArchivo = Date.now() + ext;
    cb(null, nombreArchivo);
  }
});
const upload = multer({ storage });
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
app.post('/crear', upload.single('photo'), (req, res) => {
  let { nombre, titulo, descripcion, date } = req.body;
  date = date.split('T')[0];
  const photo = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;

  const sql = 'INSERT INTO services (nombre, titulo, descripcion, photo, date) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [nombre, titulo, descripcion, photo, date], (err, result) => {
    if (err) {
      console.error('Error al insertar:', err);
      res.status(500).send('Error al guardar');
    } else {
      res.send('Registro guardado');
    }
  });
});

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
