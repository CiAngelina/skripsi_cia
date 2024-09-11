'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('teknisi', { 
      idteknisi: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nama: {
        type: Sequelize.STRING,
        allowNull: false
      },
      sektor: {
        type: Sequelize.STRING,
        allowNull: false
      },
      ket: {
        type: Sequelize.STRING,
        allowNull: false
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pass: {
        type: Sequelize.STRING,
        allowNull: false
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
    await queryInterface.dropTable('teknisi');
  }
 };

