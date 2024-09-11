'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('odp', { 
      idodp: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      namaodp: {
        type: Sequelize.STRING,
        allowNull: false
      },
    idsektor: {  // foreign key
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'sektor',  // Nama tabel yang akan dijadikan referensi
        key: 'idsektor',       // Nama kolom pada tabel referensi
      },
    },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
     });  
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('odp');
  }
 };

