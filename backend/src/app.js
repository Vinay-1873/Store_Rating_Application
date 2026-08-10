const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const storeRoutes = require('./routes/storeRoutes');
const userRoutes = require('./routes/userRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const realtime = require('./realtime');

const app = express();

app.use(helmet()); 
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(morgan('dev')); 
app.use('/api/auth', authRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/owner', ownerRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Server is up and running!' });
});

// Server-Sent Events endpoint for live store updates
app.get('/api/stores/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  if (res.flushHeaders) res.flushHeaders();

  const onUpdates = (payload) => {
    try {
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    } catch (e) {
      // ignore write errors
    }
  };

  realtime.on('storesUpdate', onUpdates);

  req.on('close', () => {
    realtime.removeListener('storesUpdate', onUpdates);
    res.end();
  });
});

// Dev-only: trigger a sample stores update for testing SSE locally
if (process.env.NODE_ENV !== 'production') {
  app.post('/api/stores/emit-test', (req, res) => {
    const sample = [
      { id: 1, name: 'Golden Market', overallRating: 4.9 },
      { id: 2, name: 'Bloom Cafe', overallRating: 4.8 },
      { id: 3, name: 'Northside Gallery', overallRating: 4.7 }
    ];
    realtime.emit('storesUpdate', sample);
    res.status(200).json({ status: 'ok', emitted: sample.length });
  });
}

app.use((req, res, next) => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;