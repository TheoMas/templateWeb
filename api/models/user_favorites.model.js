module.exports = (sequelize, Sequelize) => {
  const UserFavorites = sequelize.define("user_favorites", {
    userId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'utilisateurs',
        key: 'id'
      }
    },
    pollutionId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'pollutions',
        key: 'id'
      }
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  }, {
    timestamps: false,
    underscored: true
  });

  return UserFavorites;
};
