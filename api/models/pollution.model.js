module.exports = (sequelize, Sequelize) => {
  const Pollution = sequelize.define("pollution", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    nom: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lieu: {
      type: Sequelize.STRING
    },
    dateObservation: {
      type: Sequelize.DATE
    },
    typePollution: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.TEXT
    },
    latitude: {
      // stocke les coordonnées GPS avec 6 décimales
      type: Sequelize.DECIMAL(9,6)
    },
    longitude: {
      type: Sequelize.DECIMAL(9,6)
    },
    imageUrl: {
      type: Sequelize.STRING
    }
  }, {
    timestamps: false,
    tableName: "pollution"
  });

  return Pollution;
};
