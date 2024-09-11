module.exports = (sequelize, DataTypes) => {
    const Sektor = sequelize.define('Sektor', {
        idsektor: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
          },
          wilayahsektor: {
            type: DataTypes.STRING,
            allowNull: false
          },
          createdAt: {
            type: DataTypes.DATE,
            allowNull: false
          },
          updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
          },
    }, {
        tableName : 'sektor'
    });
     return Sektor;
    }