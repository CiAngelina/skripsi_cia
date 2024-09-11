'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tiket', { 
      idtiket: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nomortiket: {
        type: Sequelize.STRING,
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
    notepelanggan: {
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
    ket: {
      type: Sequelize.STRING,
      allowNull: false,
    },
      idpelanggan: {  // foreign key
        type: Sequelize.STRING,
        allowNull: true,
        references: {
        model: 'pelanggan',  // Nama tabel yang akan dijadikan referensi
        key: 'idpelanggan',       // Nama kolom pada tabel referensi
      },
    },
     idodp: {  //foreign key
       type: Sequelize.INTEGER,
       allowNull: true,
       references: {
       model: 'odp',  
       key: 'idodp',       
      },
    },

    idteknisi: {  //foreign key
      type: Sequelize.INTEGER,
      allowNull: true,
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


