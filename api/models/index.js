const { Sequelize } = require ("sequelize");
const config  = require ('../config');

// Use DATABASE_URL if available (Render provides this), otherwise use individual credentials
const sequelize = config.DATABASE_URL 
  ? new Sequelize(config.DATABASE_URL, {
      dialect: 'postgres',
      protocol: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      define: {
        timestamps: false
      }
    })
  : new Sequelize(`postgres://${config.BDD.user}:${config.BDD.password}@${config.BDD.host}/${config.BDD.bdname}`, {
      dialect: 'postgres',
      protocol: 'postgres',
      dialectOptions: {
        ssl: true,
        native: true
      },
      define: {
        timestamps: false
      }
    });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.pollution = require("./pollution.model.js")(sequelize, Sequelize);
db.utilisateurs = require("./utilisateurs.model.js")(sequelize, Sequelize);

module.exports = db;
