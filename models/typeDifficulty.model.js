const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TypeDifficulty = sequelize.define("TypeDifficulty", {
    TD_code: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    TD_name: {
        type: DataTypes.STRING(20),
        allowNull: false
    }
}, {
    tableName: "typeDifficulty", // שם הטבלה במסד הנתונים
    timestamps: false // לא נרצה להשתמש בזמן יצירה/עדכון אוטומטי
});

module.exports = TypeDifficulty;
