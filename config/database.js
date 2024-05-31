const { Sequelize } = require("sequelize");

// Database connection string
const sequelize = new Sequelize("railway", "postgres", "Ece51FF6c3aeF--465ACDFf6*32FbEGD", {
  host: "viaduct.proxy.rlwy.net",
  dialect: "postgres",
  port: 24957,
});

let force_reset = false;

// Synchronize models with the database
sequelize
  .sync({ force: force_reset })
  .then(async () => {
    console.log("Models synchronized with database");
    if (force_reset) {
      const { seedDatabase } = require("./seed");
      await seedDatabase();
    }
  })
  .catch((err) => {
    console.error("Error synchronizing models:", err);
  });

module.exports = sequelize;
