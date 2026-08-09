require('dotenv').config();
const app = require('./src/app.js');
const sequelize = require('./src/config/database');


const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    return sequelize.sync({ alter: true }); 
  })
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
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