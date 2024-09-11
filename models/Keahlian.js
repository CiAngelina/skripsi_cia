module.exports = (sequelize, DataTypes) => {
    const Keahlian = sequelize.define('Keahlian', {
        idkeahlian: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
          },
          namaskill: {
            type: DataTypes.STRING,
            allowNull: false
          },
          ket: {
            type: DataTypes.TEXT,
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
        tableName : 'keahlian'
    });
     return Keahlian;
    }