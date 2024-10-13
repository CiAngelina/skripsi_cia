'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tiket', { 
      nomortiket: {
        type: Sequelize.STRING,
        primaryKey: true,
        autoIncrement: false,
        allowNull: false
      },
      nomorinternet: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    keluhan: {
      type: Sequelize.STRING,
      allowNull: false
    },
      tipetiket: {
       type: Sequelize.STRING,
       allowNull: false,
     },
     status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
      idpelanggan: {  // foreign key
        type: Sequelize.STRING,
        allowNull: false,
        references: {
        model: 'pelanggan',  // Nama tabel yang akan dijadikan referensi
        key: 'idpelanggan',       // Nama kolom pada tabel referensi
      },
    },
     idodp: {  //foreign key
       type: Sequelize.STRING,
       allowNull: false,
       references: {
       model: 'odp',  
       key: 'idodp',       
      },
    },

    idteknisi: {  //foreign key
      type: Sequelize.STRING,
      allowNull: false,
      references: {
      model: 'teknisi',  
      key: 'idteknisi',       
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
    await queryInterface.dropTable('tiket');
  }
 };


