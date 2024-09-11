// module.exports = (sequelize, DataTypes) => {
//     const Keahlian_Teknisi =sequelize.define('Keahlian_Teknisi', {
//         idkt: {
//             type: DataTypes.INTEGER,
//             primaryKey: true,
//             autoIncrement: true,
//             allowNull: false
//           },
//             createdAt: {
//               type: DataTypes.DATE,
//               allowNull: false
//             },
//             updatedAt: {
//               type: DataTypes.DATE,
//               allowNull: false
//             }
//     }, {
//         tableName: 'keahlian_teknisi'
   
//    });
// // Menambahkan foreign key ke model 
//   Keahlian_Teknisi.belongsTo(sequelize.models.Teknisi, {
//   foreignKey: 'idteknisi',
//   targetKey: 'idteknisi', 
// });

// // Menambahkan foreign key ke model 
// KeahlianTeknisi.belongsTo(sequelize.models.Keahlian, {
//     foreignKey: 'idkeahlian',
//     targetKey: 'idkeahlian', 
//   });

//     return Keahlian_Teknisi;
//  }

module.exports = (sequelize, DataTypes) => {
  const Keahlian_Teknisi = sequelize.define('Keahlian_Teknisi', {
      idkt: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
      },
      idteknisi: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
              model: 'teknisi', // nama tabel referensi
              key: 'idteknisi' // nama kolom primary key pada tabel referensi
          }
      },
      idkeahlian: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
              model: 'keahlian', // nama tabel referensi
              key: 'idkeahlian' // nama kolom primary key pada tabel referensi
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
      tableName: 'keahlian_teknisi'
  });

  // Definisi relasi antara tabel Keahlian_Teknisi dengan tabel Teknisi dan Keahlian
  Keahlian_Teknisi.associate = (models) => {
      Keahlian_Teknisi.belongsTo(models.Teknisi, {
          foreignKey: 'idteknisi',
          onDelete: 'CASCADE'
      });
      Keahlian_Teknisi.belongsTo(models.Keahlian, {
          foreignKey: 'idkeahlian',
          onDelete: 'CASCADE'
      });
  };

  return Keahlian_Teknisi;
};
