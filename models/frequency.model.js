// models/frequency.model.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Frequency = sequelize.define("Frequency", {
    Fr_code: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    Fr_name: {
        type: DataTypes.STRING(30),
        allowNull: false
    }
}, {
    tableName: "frequency", // שם הטבלה במסד הנתונים
    timestamps: false // לא נרצה להשתמש בזמן יצירה/עדכון אוטומטי
});

module.exports = Frequency;
