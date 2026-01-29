module.exports = (sequelize, Sequelize) => {
  const RefreshToken = sequelize.define("refresh_tokens", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'utilisateurs',
        key: 'id'
      }
      ,
      unique: true
    },
    token: {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true
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
    tableName: 'refresh_tokens',
    timestamps: true
  });

  return RefreshToken;
};
