// models/typeOfActivity.model.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TypeOfActivity = sequelize.define("TypeOfActivity", {
    TOA_code: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    TOA_name: {
        type: DataTypes.STRING(30),
        allowNull: false
    }
}, {
    tableName: "typeOfActivity", // שם הטבלה במסד הנתונים
    timestamps: false // לא נרצה להשתמש בזמן יצירה/עדכון אוטומטי
});

module.exports = TypeOfActivity;
