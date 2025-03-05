// models/typeTask.model.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TypeTask = sequelize.define("TypeTask", {
    TT_code: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    TT_name: {
        type: DataTypes.STRING(20),
        allowNull: false
    }
}, {
    tableName: "typeTask", // שם הטבלה במסד הנתונים
    timestamps: false // לא נרצה להשתמש בזמן יצירה/עדכון אוטומטי
});

module.exports = TypeTask;
