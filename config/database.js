// const { Sequelize } = require('sequelize');
// const adminModel = require('./model/admin');


// const connection = async () => {
//   const sequelize = new Sequelize('DFU_DB4', 'postgres', 'kawther1234', {
//     host: 'localhost',
//     dialect: 'postgres',
//   });

//   let Admin = null;

//   try {
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully.');
//     Admin = adminModel(sequelize);
//     await sequelize.sync();
//     console.log('Table created successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }

//   return Admin;
// };

// module.exports = pool;

//Second try
// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize('DFU_DB5', 'postgres', 'kawther1234', {
//   host: 'localhost',
//   dialect: 'postgres',
// });

// module.exports = sequelize;


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
