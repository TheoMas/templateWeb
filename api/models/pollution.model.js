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
      allowNull: false,
      field: 'type_pollution'
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    date_observation: {
      type: Sequelize.DATEONLY,
      allowNull: false,
      field: 'date_observation'
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
      type: Sequelize.TEXT,
      allowNull: true,
      field: 'photo_url'
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      field: 'created_at'
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      field: 'updated_at'
    }
  }, {
    tableName: 'pollutions',
    timestamps: false,
    underscored: false
  });

  return Pollution;
};