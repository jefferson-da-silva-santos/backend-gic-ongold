'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      valor_unitario: {
        type: Sequelize.DECIMAL
      },
      descricao: {
        type: Sequelize.STRING
      },
      taxa_icms_entrada: {
        type: Sequelize.DECIMAL
      },
      taxa_icms_saida: {
        type: Sequelize.DECIMAL
      },
      comissao: {
        type: Sequelize.DECIMAL
      },
      ncm: {
        type: Sequelize.STRING
      },
      cst: {
        type: Sequelize.STRING
      },
      cfop: {
        type: Sequelize.INTEGER
      },
      ean: {
        type: Sequelize.STRING
      },
      excluido: {
        type: Sequelize.BOOLEAN
      },
      criado_em: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Items');
  }
};