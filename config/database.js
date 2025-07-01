const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        logging: false,
/*         pool: {
            max: 20,
            min: 0,
            acquire: 60000,
            idle: 10000
        } */
        pool: {
            max: 30,
            min: 0,
            acquire: 120000, // 2 דקות
            idle: 10000
        }

    }
);

module.exports = sequelize;