const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const DATA_PATH = path.join(__dirname, 'citas.json');

app.use(cors());
app.use(bodyParser.json());

// Endpoint para obtener todas las citas
app.get('/citas', (req, res) => {
  fs.readFile(DATA_PATH, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'No se pudo leer el archivo de citas.' });
    }
    res.json(JSON.parse(data));
  });
});

// Endpoint para actualizar todas las citas (PUT)
app.put('/citas', (req, res) => {
  const nuevasCitas = req.body;
  fs.writeFile(DATA_PATH, JSON.stringify(nuevasCitas, null, 2), 'utf8', err => {
    if (err) {
      return res.status(500).json({ error: 'No se pudo guardar el archivo de citas.' });
    }
    res.json({ mensaje: 'Citas actualizadas correctamente.' });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
