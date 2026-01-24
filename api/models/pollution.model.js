module.exports = (sequelize, Sequelize) => {
  const Pollution = sequelize.define("pollution", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    titre: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    type_pollution: {
      type: Sequelize.ENUM('Plastique', 'Chimique', 'Dépôt sauvage', 'Eau', 'Air', 'Autre'),
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    date_observation: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    lieu: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    latitude: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    longitude: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    photo_url: {
      type: Sequelize.TEXT
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  }, {
    timestamps: false,
    underscored: true
  });

  return Pollution;
};