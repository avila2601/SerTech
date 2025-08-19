const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_PATH = path.join(__dirname, 'appointments.json');
const REVIEWS_PATH = path.join(__dirname, 'reviews.json');

app.use(cors());
app.use(bodyParser.json());

// Endpoint de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'API SerTech funcionando correctamente' });
});

// Endpoints para appointments
app.get('/appointments', (req, res) => {
  fs.readFile(DATA_PATH, 'utf8', (err, data) => {
    if (err) {
      console.log('Error reading appointments file:', err);
      // Si el archivo no existe, retornar array vacío
      return res.json([]);
    }
    try {
      const json = JSON.parse(data);
      res.json(json.citas || []); // Solo el array de citas
    } catch (parseError) {
      console.log('Error parsing appointments JSON:', parseError);
      res.json([]);
    }
  });
});

app.put('/appointments', (req, res) => {
  const nuevasCitas = req.body;
  fs.readFile(DATA_PATH, 'utf8', (err, data) => {
    let json = { citas: [], clientes: [], ultimoIdCliente: 0, ultimoIdCita: 0 };

    if (!err) {
      try {
        json = JSON.parse(data);
      } catch (parseError) {
        console.log('Error parsing existing appointments file:', parseError);
      }
    }

    json.citas = nuevasCitas;
    fs.writeFile(DATA_PATH, JSON.stringify(json, null, 2), 'utf8', err => {
      if (err) {
        return res.status(500).json({ error: 'No se pudo guardar el archivo de citas.' });
      }
      res.json({ mensaje: 'Appointments updated successfully.' });
    });
  });
});

// Endpoints para clients
app.get('/clients', (req, res) => {
  fs.readFile(DATA_PATH, 'utf8', (err, data) => {
    if (err) {
      console.log('Error reading clients file:', err);
      // Si el archivo no existe, retornar array vacío
      return res.json([]);
    }
    try {
      const json = JSON.parse(data);
      res.json(json.clientes || []); // Solo el array de clientes
    } catch (parseError) {
      console.log('Error parsing clients JSON:', parseError);
      res.json([]);
    }
  });
});

app.put('/clients', (req, res) => {
  const nuevosClientes = req.body;
  fs.readFile(DATA_PATH, 'utf8', (err, data) => {
    let json = { citas: [], clientes: [], ultimoIdCliente: 0, ultimoIdCita: 0 };

    if (!err) {
      try {
        json = JSON.parse(data);
      } catch (parseError) {
        console.log('Error parsing existing clients file:', parseError);
      }
    }

    json.clientes = nuevosClientes;
    fs.writeFile(DATA_PATH, JSON.stringify(json, null, 2), 'utf8', err => {
      if (err) {
        return res.status(500).json({ error: 'No se pudo guardar el archivo de clientes.' });
      }
      res.json({ mensaje: 'Clients updated successfully.' });
    });
  });
});

// Endpoints para reviews
app.get('/reviews', (req, res) => {
  fs.readFile(REVIEWS_PATH, 'utf8', (err, data) => {
    if (err) {
      console.log('Error reading reviews file:', err);
      return res.json([]);
    }
    try {
      const resenas = JSON.parse(data);
      res.json(resenas);
    } catch (parseError) {
      console.log('Error parsing reviews JSON:', parseError);
      res.json([]);
    }
  });
});

app.put('/reviews', (req, res) => {
  const nuevasResenas = req.body;
  fs.writeFile(REVIEWS_PATH, JSON.stringify(nuevasResenas, null, 2), 'utf8', err => {
    if (err) {
      return res.status(500).json({ error: 'No se pudo guardar el archivo de reseñas.' });
    }
    res.json({ mensaje: 'Reviews updated successfully.' });
  });
});

// Endpoint para obtener reseñas por técnico
app.get('/reviews/:technicianId', (req, res) => {
  const technicianId = req.params.technicianId;
  fs.readFile(REVIEWS_PATH, 'utf8', (err, data) => {
    if (err) {
      console.log('Error reading reviews file:', err);
      return res.json([]);
    }
    try {
      const reviews = JSON.parse(data);
      const technicianReviews = reviews.filter(review => review.technicianId === technicianId);
      res.json(technicianReviews);
    } catch (parseError) {
      console.log('Error parsing reviews JSON:', parseError);
      res.json([]);
    }
  });
});

// Endpoint para verificar si existe una reseña para una cita
app.get('/reviews/exists/:appointmentId', (req, res) => {
  const appointmentId = req.params.appointmentId;
  fs.readFile(REVIEWS_PATH, 'utf8', (err, data) => {
    if (err) {
      console.log('Error reading reviews file:', err);
      return res.json({ exists: false });
    }
    try {
      const reviews = JSON.parse(data);
      const exists = reviews.some(review => review.appointmentId === appointmentId);
      res.json({ exists });
    } catch (parseError) {
      console.log('Error parsing reviews JSON:', parseError);
      res.json({ exists: false });
    }
  });
});

// Endpoint para crear una nueva reseña
app.post('/reviews', (req, res) => {
  const newReview = req.body;
  fs.readFile(REVIEWS_PATH, 'utf8', (err, data) => {
    if (err) {
      console.log('Error reading reviews file:', err);
      // Si no existe el archivo, creamos array vacío
      data = '[]';
    }

    try {
      const reviews = JSON.parse(data);

      // Generar nuevo ID
      const newId = (reviews.length + 1).toString();
      const reviewWithId = {
        id: newId,
        ...newReview
      };

      reviews.push(reviewWithId);

      fs.writeFile(REVIEWS_PATH, JSON.stringify(reviews, null, 2), 'utf8', err => {
        if (err) {
          return res.status(500).json({ error: 'No se pudo guardar la reseña.' });
        }
        res.status(201).json(reviewWithId);
      });
    } catch (parseError) {
      console.log('Error parsing reviews JSON:', parseError);
      res.status(500).json({ error: 'Error parsing reviews data.' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en puerto ${PORT}`);
});

// Endpoint para borrar todos los datos (clientes, citas, reseñas)
app.delete('/debug/clear-all', (req, res) => {
  // Limpiar citas y clientes
  const emptyData = {
    citas: [],
    clientes: [],
    ultimoIdCliente: 0,
    ultimoIdCita: 0
  };
  fs.writeFile(DATA_PATH, JSON.stringify(emptyData, null, 2), 'utf8', err => {
    if (err) {
      return res.status(500).json({ error: 'No se pudo limpiar citas y clientes.' });
    }
    // Limpiar reseñas
    fs.writeFile(REVIEWS_PATH, JSON.stringify([], null, 2), 'utf8', err2 => {
      if (err2) {
        return res.status(500).json({ error: 'No se pudo limpiar reseñas.' });
      }
      res.json({ mensaje: 'Todos los datos han sido eliminados correctamente.' });
    });
  });
});
