const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const City = sequelize.define("City", {
    Ci_code: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    Ci_name: { type: DataTypes.STRING, allowNull: false}
}, {
    tableName: "city" ,
    timestamps: false
});

module.exports = City;
