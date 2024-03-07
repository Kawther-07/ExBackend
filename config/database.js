const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('DFU_DB5', 'postgres', 'kawther1234', {
  host: 'localhost',
  dialect: 'postgres',
});

// Synchronize models with the database
sequelize.sync()
  .then(() => {
    console.log('Models synchronized with database');
  })
  .catch(err => {
    console.error('Error synchronizing models:', err);
  });

module.exports = sequelize;
