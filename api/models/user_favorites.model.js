module.exports = (sequelize, Sequelize) => {
  const UserFavorites = sequelize.define("user_favorites", {
    userId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      field: 'userId',
      references: {
        model: 'utilisateurs',
        key: 'id'
      }
    },
    pollutionId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      field: 'pollutionId',
      references: {
        model: 'pollutions',
        key: 'id'
      }
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      field: 'createdAt'
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      field: 'updatedAt'
    }
  }, {
    tableName: 'user_favorites',
    timestamps: false
  });

  return UserFavorites;
};
