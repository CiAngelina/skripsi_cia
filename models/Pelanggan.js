module.exports = (sequelize, DataTypes) => {
    const Pelanggan = sequelize.define('Pelanggan', {
        idpelanggan: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
          },
          nama: {
            type: DataTypes.STRING,
            allowNull: false
          },
          nohp: {
            type: DataTypes.STRING,
            allowNull: false
          },
          alamat: {
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
        tableName : 'pelanggan'
    });
     return Pelanggan;
    }