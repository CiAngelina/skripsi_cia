'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('keahlian', { 
      idkeahlian: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      namaskill: {
        type: Sequelize.STRING,
        allowNull: false
      },
      ket: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable('keahlian');
  }
 };

