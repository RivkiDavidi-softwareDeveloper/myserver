// models/community.model.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Community = sequelize.define("Community", {
    Com_code: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    Com_name: {
        type: DataTypes.STRING(30),
        allowNull: false
    }
}, {
    tableName: "community", // שם הטבלה במסד הנתונים
    timestamps: false // לא נרצה להשתמש בזמן יצירה/עדכון אוטומטי
});

module.exports = Community;
