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

// Endpoint para obtener todas las citas
app.get('/citas', (req, res) => {
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

// Endpoint para actualizar todas las citas (PUT)
app.put('/citas', (req, res) => {
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
      res.json({ mensaje: 'Citas actualizadas correctamente.' });
    });
  });
});

// API endpoints para compatibilidad con Angular
app.get('/api/appointments', (req, res) => {
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

app.put('/api/appointments', (req, res) => {
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
      res.json({ mensaje: 'Citas actualizadas correctamente.' });
    });
  });
});

app.get('/api/clients', (req, res) => {
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

app.put('/api/clients', (req, res) => {
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
      res.json({ mensaje: 'Clientes actualizados correctamente.' });
    });
  });
});

// Endpoint para obtener todos los clientes
app.get('/clientes', (req, res) => {
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

// Endpoint para actualizar todos los clientes (PUT)
app.put('/clientes', (req, res) => {
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
      res.json({ mensaje: 'Clientes actualizados correctamente.' });
    });
  });
});

// Endpoint para obtener todas las reseñas
app.get('/resenas', (req, res) => {
  fs.readFile(REVIEWS_PATH, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'No se pudo leer el archivo de reseñas.' });
    }
    const resenas = JSON.parse(data);
    res.json(resenas);
  });
});

// Endpoint para obtener reseñas por técnico (para el nuevo repositorio)
app.get('/api/reviews/:technicianId', (req, res) => {
  const technicianId = req.params.technicianId;
  fs.readFile(REVIEWS_PATH, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'No se pudo leer el archivo de reseñas.' });
    }
    const reviews = JSON.parse(data);
    const technicianReviews = reviews.filter(review => review.technicianId === technicianId);
    res.json(technicianReviews);
  });
});

// Endpoint para verificar si existe una reseña para una cita
app.get('/api/reviews/exists/:appointmentId', (req, res) => {
  const appointmentId = req.params.appointmentId;
  fs.readFile(REVIEWS_PATH, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'No se pudo leer el archivo de reseñas.' });
    }
    const reviews = JSON.parse(data);
    const exists = reviews.some(review => review.appointmentId === appointmentId);
    res.json({ exists });
  });
});

// Endpoint para crear una nueva reseña
app.post('/api/reviews', (req, res) => {
  const newReview = req.body;
  fs.readFile(REVIEWS_PATH, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'No se pudo leer el archivo de reseñas.' });
    }
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
  });
});

// Endpoint para actualizar todas las reseñas (PUT)
app.put('/resenas', (req, res) => {
  const nuevasResenas = req.body;
  fs.writeFile(REVIEWS_PATH, JSON.stringify(nuevasResenas, null, 2), 'utf8', err => {
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
