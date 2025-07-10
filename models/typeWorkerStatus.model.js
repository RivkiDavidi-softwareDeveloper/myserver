// models/typeWorker.model.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const typeWorkerStatus = sequelize.define("typeWorkerStatus", {
      TWS_code: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      TWS_name: {
        type: DataTypes.STRING(20),
        allowNull: false
      }
   
}, {
    tableName: "typeWorkerStatus", // שם הטבלה במסד הנתונים
    timestamps: false // לא נרצה להשתמש בזמן יצירה/עדכון אוטומטי
});

module.exports = typeWorkerStatus;
