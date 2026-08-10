require('dotenv').config();
const app = require('./src/app.js');
const sequelize = require('./src/config/database');
const { User, Store } = require('./src/models');
const { Server } = require('socket.io');
const realtime = require('./src/realtime');

const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    return sequelize.sync({ force: true });
  })
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });

    // Attach Socket.IO
    const io = new Server(server, {
      cors: {
        origin: process.env.NODE_ENV === 'production' ? true : 'http://localhost:5173',
        methods: ['GET', 'POST']
      }
    });

    // Broadcast realtime events from the EventEmitter
    realtime.on('storesUpdate', (payload) => {
      io.emit('storesUpdate', payload);
    });

    io.on('connection', (socket) => {
      console.log('Socket connected:', socket.id);
      socket.on('disconnect', () => {
        // console.log('Socket disconnected:', socket.id);
      });
    });

    process.on('unhandledRejection', (err) => {
      console.log(`Error: ${err.message}`);
      console.log('Shutting down the server due to Unhandled Promise Rejection');
      server.close(() => {
        process.exit(1);
      });
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });