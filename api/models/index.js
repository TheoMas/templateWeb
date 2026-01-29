const { Sequelize } = require ("sequelize");
const { BDD }  = require ('../config.js');

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
db.user_favorites = require("./user_favorites.model.js")(sequelize, Sequelize);
db.refresh_token = require("./refresh_token.model.js")(sequelize, Sequelize);

// Define associations (many-to-many relationship)
db.utilisateurs.belongsToMany(db.pollution, { 
  through: db.user_favorites, 
  foreignKey: 'userId',
  as: 'favorites'
});

db.pollution.belongsToMany(db.utilisateurs, { 
  through: db.user_favorites, 
  foreignKey: 'pollutionId',
  as: 'favoritedBy'
});

// Associations for eager loading
db.user_favorites.belongsTo(db.pollution, { 
  foreignKey: 'pollutionId',
  as: 'pollution'
});

db.user_favorites.belongsTo(db.utilisateurs, { 
  foreignKey: 'userId',
  as: 'user'
});

module.exports = db;
