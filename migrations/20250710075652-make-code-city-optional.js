'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('student', 'St_city_code', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "city",
        key: "Ci_code"
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('student', 'St_city_code', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "city",
        key: "Ci_code"
      }
    });
  }
};
