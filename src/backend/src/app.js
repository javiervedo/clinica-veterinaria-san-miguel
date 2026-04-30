const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const propietariosRoutes = require('./routes/propietariosRoutes');
const mascotasRoutes = require('./routes/mascotasRoutes');
const citasRoutes = require('./routes/citasRoutes');
const episodiosRoutes = require('./routes/episodiosRoutes');
const tratamientosRoutes = require('./routes/tratamientosRoutes');
const recordatoriosRoutes = require('./routes/recordatoriosRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API operativa' });
});

app.use('/api/auth', authRoutes);

app.use('/api/propietarios', propietariosRoutes);
app.use('/api/mascotas', mascotasRoutes);
app.use('/api/citas', citasRoutes);
app.use('/api/episodios', episodiosRoutes);
app.use('/api/tratamientos', tratamientosRoutes);
app.use('/api/recordatorios', recordatoriosRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({
    error: 'Error interno del servidor',
    detalle: err.message
  });
});

module.exports = app;
