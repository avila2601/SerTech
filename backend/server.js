const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_PATH = path.join(__dirname, 'citas.json');
const RESENAS_PATH = path.join(__dirname, 'resenas.json');

app.use(cors());
app.use(bodyParser.json());

// Endpoint de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'API SerTech funcionando correctamente' });
});

// Endpoint para obtener todas las citas
app.get('/citas', (req, res) => {
  fs.readFile(DATA_PATH, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'No se pudo leer el archivo de citas.' });
    }
    const json = JSON.parse(data);
    res.json(json.citas); // Solo el array de citas
  });
});

// Endpoint para actualizar todas las citas (PUT)
app.put('/citas', (req, res) => {
  const nuevasCitas = req.body;
  fs.readFile(DATA_PATH, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'No se pudo leer el archivo de citas.' });
    }
    let json = JSON.parse(data);
    json.citas = nuevasCitas;
    fs.writeFile(DATA_PATH, JSON.stringify(json, null, 2), 'utf8', err => {
      if (err) {
        return res.status(500).json({ error: 'No se pudo guardar el archivo de citas.' });
      }
      res.json({ mensaje: 'Citas actualizadas correctamente.' });
    });
  });
});

// Endpoint para obtener todos los clientes
app.get('/clientes', (req, res) => {
  fs.readFile(DATA_PATH, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'No se pudo leer el archivo de clientes.' });
    }
    const json = JSON.parse(data);
    res.json(json.clientes); // Solo el array de clientes
  });
});

// Endpoint para actualizar todos los clientes (PUT)
app.put('/clientes', (req, res) => {
  const nuevosClientes = req.body;
  fs.readFile(DATA_PATH, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'No se pudo leer el archivo de clientes.' });
    }
    let json = JSON.parse(data);
    json.clientes = nuevosClientes;
    fs.writeFile(DATA_PATH, JSON.stringify(json, null, 2), 'utf8', err => {
      if (err) {
        return res.status(500).json({ error: 'No se pudo guardar el archivo de clientes.' });
      }
      res.json({ mensaje: 'Clientes actualizados correctamente.' });
    });
  });
});

// Endpoint para obtener todas las reseñas
app.get('/resenas', (req, res) => {
  fs.readFile(RESENAS_PATH, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'No se pudo leer el archivo de reseñas.' });
    }
    const resenas = JSON.parse(data);
    res.json(resenas);
  });
});

// Endpoint para actualizar todas las reseñas (PUT)
app.put('/resenas', (req, res) => {
  const nuevasResenas = req.body;
  fs.writeFile(RESENAS_PATH, JSON.stringify(nuevasResenas, null, 2), 'utf8', err => {
    if (err) {
      return res.status(500).json({ error: 'No se pudo guardar el archivo de reseñas.' });
    }
    res.json({ mensaje: 'Reseñas actualizadas correctamente.' });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en puerto ${PORT}`);
});
