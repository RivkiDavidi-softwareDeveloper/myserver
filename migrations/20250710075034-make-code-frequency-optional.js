'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('student', 'St_code_frequency', {
       type: Sequelize.BIGINT,
        allowNull: true,
        references: {
            model: "frequency",
            key: "Fr_code"
        }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('student', 'St_code_frequency', {
     type: Sequelize.BIGINT,
        allowNull: false,
        references: {
            model: "frequency",
            key: "Fr_code"
        }
    });
  }
};
