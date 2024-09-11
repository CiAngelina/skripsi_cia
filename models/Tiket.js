module.exports = (sequelize, DataTypes) => {
    const Tiket = sequelize.define('Tiket', {
      idtiket: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nomortiket: {
        type: DataTypes.STRING,
        allowNull: false
      },
      nomorinternet: {
        type: DataTypes.STRING,
        allowNull: false
      },
      keluhan: {
        type: DataTypes.STRING,
         allowNull: false,
     },
     notepelanggan: {
      type: DataTypes.STRING,
       allowNull: false,
   },
      tipetiket: {
        type: DataTypes.STRING,
        allowNull: false,
     },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ket: {
     type: DataTypes.STRING,
      allowNull: false,
  },
      idpelanggan: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: 'Pelanggan', // nama tabel referensi
          key: 'idpelanggan' // nama kolom primary key pada tabel referensi
        }
      },
      idodp: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Odp', // nama tabel referensi
          key: 'idodp' // nama kolom primary key pada tabel referensi
        }
      },
      idteknisi: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Teknisi', // nama tabel referensi
          key: 'idteknisi' // nama kolom primary key pada tabel referensi
        }
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
      tableName: 'tiket'
    });
  
    // Definisi relasi antara tabel Teknisi dengan tabel Pelanggan, Odp, dan Teknisi
    Tiket.associate = (models) => {
      Tiket.belongsTo(models.Pelanggan, {
        foreignKey: 'idpelanggan',
        onDelete: 'SET NULL'
      });
      Tiket.belongsTo(models.Odp, {
        foreignKey: 'idodp',
        onDelete: 'SET NULL'
      });
      Tiket.belongsTo(models.Teknisi, {
        foreignKey: 'idteknisi',
        onDelete: 'SET NULL'
      });
    };
  
    return Tiket;
  };
  