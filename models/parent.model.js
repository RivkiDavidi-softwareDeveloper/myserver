// models/parent.model.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Parent = sequelize.define("Parent", {
    Pa_code: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    Pa_ID: {
        type: DataTypes.STRING(9),
        allowNull: true
    },
    Pa_name: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    Pa_cell_phone: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    Pa_work: {
        type: DataTypes.STRING(50),
        allowNull: true
    }
}, {
    tableName: "parent", // שם הטבלה במסד הנתונים
    timestamps: false // לא נרצה להשתמש בזמן יצירה/עדכון אוטומטי
});

module.exports = Parent;
