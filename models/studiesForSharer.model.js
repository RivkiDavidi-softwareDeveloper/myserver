const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const StudiesForSharer = sequelize.define("StudiesForSharer", {
    SFS_code: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    SFS_Sharer_code: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: "sharer", // שם הטבלה Sharer
            key: "Sh_code"
        }
    },
    SFS_current_school: {
        type: DataTypes.STRING(60),
        allowNull: true
    },
    SFS_current_school_ame: {
        type: DataTypes.STRING(60),
        allowNull: true
    },
    SFS_current_class: {
        type: DataTypes.STRING(60),
        allowNull: true
    },
    SFS_previous_school: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    
    SFS_last_upgrade_year: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: "studiesForSharer",
    timestamps: false
});

// הגדרת מפתח זר באמצעות associations
StudiesForSharer.associate = function (models) {
    StudiesForSharer.belongsTo(models.Sharer, { foreignKey: "SFS_Sharer_code" });
};

module.exports = StudiesForSharer;
