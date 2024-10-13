module.exports = (sequelize, DataTypes) => {
    const Teknisi = sequelize.define('Teknisi', {
        idteknisi: {
            type: DataTypes.STRING,
            primaryKey: true,
            autoIncrement: false,
            allowNull: false
          },
          nama: {
            type: DataTypes.STRING,
            allowNull: false
          },
          ket: {
            type: DataTypes.STRING,
            allowNull: false
          },
          username: {
            type: DataTypes.STRING,
            allowNull: false
          },
          pass: {
            type: DataTypes.STRING,
            allowNull: false
          },
          kehadiran: {
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
        }
    }, {
        tableName : 'teknisi'
    });
     return Teknisi;
    }