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

// English alias endpoints for clients and appointments
// GET all clients
app.get('/clients', (req, res) => {
  fs.readFile(DATA_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Unable to read clients file.' });
    const json = JSON.parse(data);
    res.json(json.clients);
  });
});
// PUT update all clients
app.put('/clients', (req, res) => {
  const newClients = req.body;
  fs.readFile(DATA_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Unable to read clients file.' });
    let json = JSON.parse(data);
    json.clients = newClients;
    fs.writeFile(DATA_PATH, JSON.stringify(json, null, 2), 'utf8', err2 => {
      if (err2) return res.status(500).json({ error: 'Unable to write clients file.' });
      res.json({ message: 'Clients updated successfully.' });
    });
  });
});
// GET all appointments
app.get('/appointments', (req, res) => {
  fs.readFile(DATA_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Unable to read appointments file.' });
    const json = JSON.parse(data);
    res.json(json.appointments);
  });
});
// PUT update all appointments
app.put('/appointments', (req, res) => {
  const newAppointments = req.body;
  fs.readFile(DATA_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Unable to read appointments file.' });
    let json = JSON.parse(data);
    json.appointments = newAppointments;
    fs.writeFile(DATA_PATH, JSON.stringify(json, null, 2), 'utf8', err2 => {
      if (err2) return res.status(500).json({ error: 'Unable to write appointments file.' });
      res.json({ message: 'Appointments updated successfully.' });
    });
  });
});

// English alias endpoints for reviews
// GET all reviews
app.get('/reviews', (req, res) => {
  fs.readFile(RESENAS_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Unable to read reviews file.' });
    const reviews = JSON.parse(data);
    res.json(reviews);
  });
});
// PUT update all reviews
app.put('/reviews', (req, res) => {
  const newReviews = req.body;
  fs.writeFile(RESENAS_PATH, JSON.stringify(newReviews, null, 2), 'utf8', err => {
    if (err) return res.status(500).json({ error: 'Unable to write reviews file.' });
    res.json({ message: 'Reviews updated successfully.' });
  });
});
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
    res.json(json.appointments); // Solo el array de appointments
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
    json.appointments = nuevasCitas;
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
    res.json(json.clients); // Solo el array of clients
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
    json.clients = nuevosClientes;
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

// Endpoint para borrar todos los datos (clientes, citas, reseñas)
app.delete('/debug/clear-all', (req, res) => {
  // Limpiar citas y clientes
  const emptyData = {
    appointments: [],
    clients: [],
    lastClientId: 0,
    lastAppointmentId: 0
  };
  fs.writeFile(DATA_PATH, JSON.stringify(emptyData, null, 2), 'utf8', err => {
    if (err) {
      return res.status(500).json({ error: 'No se pudo limpiar citas y clientes.' });
    }
    // Limpiar reseñas
    fs.writeFile(RESENAS_PATH, JSON.stringify([], null, 2), 'utf8', err2 => {
      if (err2) {
        return res.status(500).json({ error: 'No se pudo limpiar reseñas.' });
      }
      res.json({ mensaje: 'Todos los datos han sido eliminados correctamente.' });
    });
  });
});
