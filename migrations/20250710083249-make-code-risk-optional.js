'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('student', 'St_risk_code', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "typeRisk",
        key: "TR_code"
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('student', 'St_risk_code', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "typeRisk",
        key: "TR_code"
      }
    });
  }
};
