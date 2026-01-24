const { Sequelize } = require ("sequelize");
const { BDD }  = require ('../config');

const sequelize = new Sequelize(BDD.bdname, BDD.user, BDD.password, {
    host: BDD.host,
    port: BDD.port,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    define:  {
    	timestamps:false
    }
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.pollution = require("./pollution.model.js")(sequelize, Sequelize);
db.utilisateurs = require("./utilisateurs.model.js")(sequelize, Sequelize);

module.exports = db;
