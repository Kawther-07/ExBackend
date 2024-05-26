const { Sequelize } = require("sequelize");

// postgresql://postgres:Ece51FF6c3aeF--465ACDFf6*32FbEGD@viaduct.proxy.rlwy.net:24957/railway
// const sequelize = new Sequelize("railway", "postgres", "Ece51FF6c3aeF--465ACDFf6*32FbEGD", {
//   host: "viaduct.proxy.rlwy.net",
//   dialect: "postgres",
//   port: 24957,
// });

const sequelize = new Sequelize('dunno', 'postgres', 'kawther1234', {
  host: 'localhost',
  dialect: 'postgres',
});

// Synchronize models with the database
sequelize
  .sync()
  .then(() => {
    console.log("Models synchronized with database");
  })
  .catch((err) => {
    console.error("Error synchronizing models:", err);
  });

module.exports = sequelize;
