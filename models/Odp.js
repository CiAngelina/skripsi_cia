// module.exports = (sequelize, DataTypes) => {
//     const Odp =sequelize.define('Odp', {
//         idodp: {
//             type: DataTypes.INTEGER,
//             primaryKey: true,
//             autoIncrement: true,
//             allowNull: false
//           },
//           namaodp: {
//             type: DataTypes.STRING,
//             allowNull: false
//           },
//           createdAt: {
//             type: DataTypes.DATE,
//             allowNull: false
//           },
//           updatedAt: {
//             type: DataTypes.DATE,
//             allowNull: false
//           },
//     }, {
//         tableName: 'odp'
   
//    });
// // Menambahkan foreign key ke model Odp
//   Odp.belongsTo(sequelize.models.Sektor, {
//   foreignKey: 'idsektor', // Nama kolom foreign key pada tabel "odp"
//   targetKey: 'idsektor', // Nama kolom pada tabel "sektor" yang dijadikan referensi
// });
//     return Odp;
//  }
module.exports = (sequelize, DataTypes) => {
  const Odp = sequelize.define('Odp', {
      idodp: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
      },
      namaodp: {
          type: DataTypes.STRING,
          allowNull: false
      },
      idsektor: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
              model: 'sektor', // Nama tabel referensi
              key: 'idsektor' // Nama field yang direferensikan di tabel sektor
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
      tableName: 'odp'
  });

  Odp.associate = models => {
      Odp.belongsTo(models.Sektor, {
          foreignKey: 'idsektor',
          onDelete: 'CASCADE' // Opsional: atur aksi on delete
      });
  };

  return Odp;
};
