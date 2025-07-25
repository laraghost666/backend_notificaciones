const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads')); // Servir imágenes

// Configuración de multer para archivos
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

// Pool de conexiones MySQL
const pool = mysql.createPool({
  host: 'db-buf-03.sparkedhost.us',
  user: 'u181458_F6wWqVn52c',
  password: 'YgkD+JaMLA@7IE79AR!QlUi!',
  database: 's181458_notificacion', // Cambia por el nombre de tu DB
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API funcionando');
});

// CRUD básico para "usuarios"
app.get('/usuarios', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM services');
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al consultar usuarios');
  }
});

app.post('/crear', upload.single('photo'), async (req, res) => {
  let { nombre, titulo, descripcion, date } = req.body;
  date = date.split('T')[0];
  const photo = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;

  try {
    const sql = 'INSERT INTO services (nombre, titulo, descripcion, photo, date) VALUES (?, ?, ?, ?, ?)';
    await pool.query(sql, [nombre, titulo, descripcion, photo, date]);
    res.send('Registro guardado');
  } catch (err) {
    console.error('Error al insertar:', err);
    res.status(500).send('Error al guardar');
  }
});

app.get('/ver/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await pool.query('SELECT * FROM services WHERE id = ?', [id]);
    if (results.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar' });
  }
});

app.post('/login', async (req, res) => {
  const { usuario, password } = req.body;
  const sql = 'SELECT * FROM usuarios WHERE usuario = ? AND password = ?';
  try {
    const [results] = await pool.query(sql, [usuario, password]);
    if (results.length > 0) {
      res.json({ success: true, user: results[0] });
    } else {
      res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error en servidor' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
