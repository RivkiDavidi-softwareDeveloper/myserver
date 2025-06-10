const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Sharer = sequelize.define("Sharer", {
    Sh_code: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    Sh_ID: {
        type: DataTypes.STRING(9),
        allowNull: false
    },
    Sh_gender: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: "TypeGender", // שם הטבלה TypeGender
            key: "TG_code"
        }
    },
    Sh_name: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    Sh_Fname: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    Sh_birthday: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    Sh_father_code: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: "Parent", // שם הטבלה Parent
            key: "Pa_code"
        }
    },
    Sh_mother_code: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: "Parent", // שם הטבלה Parent
            key: "Pa_code"
        }
    },
    Sh_city_code: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: "City", // שם הטבלה City
            key: "Ci_code"
        }
    },
    Sh_address: {
        type: DataTypes.STRING(40),
        allowNull: true
    },
    Sh_cell_phone: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    Sh_phone: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    Sh_name_school_bein_hazmanim: {
        type: DataTypes.STRING(40),
        allowNull: true
    },
    Sh_nusah_tfila: {
        type: DataTypes.STRING(40),
        allowNull: true
    }
    ,
    Sh_veshinantem: {
        type: DataTypes.STRING(40),
        allowNull: true
    }
}, {
    tableName: "sharer",
    timestamps: false
});

// הגדרת מפתחות זרים באמצעות associations
Sharer.associate = function (models) {
    Sharer.belongsTo(models.TypeGender, { foreignKey: "Sh_gender" });
    Sharer.belongsTo(models.Parent, { foreignKey: "Sh_father_code" });
    Sharer.belongsTo(models.Parent, { foreignKey: "Sh_mother_code" });
    Sharer.belongsTo(models.City, { foreignKey: "Sh_city_code" });
};

module.exports = Sharer;
