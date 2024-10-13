module.exports = (sequelize, DataTypes) => {
  const Odp = sequelize.define('Odp', {
      idodp: {
          type: DataTypes.STRING,
          primaryKey: true,
          autoIncrement: false,
          allowNull: false
      },
      createdAt: {
          type: DataTypes.DATE,
          allowNull: false
      },
      updatedAt: {
          type: DataTypes.DATE,
          allowNull: false
      }
  }, {
      tableName: 'odp'
  });


  return Odp;
};
