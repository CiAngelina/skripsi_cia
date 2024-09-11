'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('keahlian_teknisi', { 
      idkt: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      idteknisi: {  // foreign key
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'teknisi',  // Nama tabel yang akan dijadikan referensi
          key: 'idteknisi',       // Nama kolom pada tabel referensi
        },
      },
    idkeahlian: {  //foreign key
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'keahlian',  
        key: 'idkeahlian',       
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
    await queryInterface.dropTable('keahlian_teknisi');
  }
 };

