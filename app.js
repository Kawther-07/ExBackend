const express = require('express');
const { Pool } = require('pg');
const sequelize = require('./models/admin'); // Import Sequelize instance

const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');

// Create an Express application
const app = express();
app.use(bodyParser.json());

// Middleware to parse JSON request bodies
app.use(express.json());

// Set up database connection configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'DFU_DB4',
  password: 'kawther1234',
  port: 5432, // PostgreSQL default port
});

// Test the database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to PostgreSQL database:', res.rows[0].now);

    // Synchronize the Sequelize models with the database
    sequelize.sync()
      .then(() => {
        console.log('All models synchronized with database');
      })
      .catch(err => {
        console.error('Error synchronizing models:', err);
      });
  }
});

app.use('/api', apiRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
