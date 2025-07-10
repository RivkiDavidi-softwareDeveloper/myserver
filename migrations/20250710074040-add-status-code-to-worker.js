'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('worker', 'Wo_status_code', {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: 'typeWorkerStatus', // שם הטבלה המקושרת
        key: 'TWS_code'            // המפתח בטבלה המקושרת
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('worker', 'Wo_status_code');
  }
};

