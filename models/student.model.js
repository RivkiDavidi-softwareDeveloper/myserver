// models/student.model.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Student = sequelize.define("Student", {
    St_code: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    St_ID: {
        type: DataTypes.STRING(9),
        allowNull: false
    },
    St_gender: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: "typeGender",
            key: "TG_code"
        }
    },
    St_name: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    St_Fname: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    St_image: {
        type: DataTypes.STRING(400),
        allowNull: true
    },
    St_birthday: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    St_father_code: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: "parent",
            key: "Pa_code"
        }
    },
    St_mother_code: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: "parent",
            key: "Pa_code"
        }
    },
    St_city_code: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "city",
            key: "Ci_code"
        }
    },
    St_address: {
        type: DataTypes.STRING(40),
        allowNull: true
    },
    St_cell_phone: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    St_phone: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    St_email: {
        type: DataTypes.STRING(60),
        allowNull: true
    },
    St_worker_code: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: "worker",
            key: "Wo_code"
        }
    },
    St_activity_status: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: "typeActivityState",
            key: "TAS_code"
        }
    },
    St_risk_code: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: "typeRisk",
            key: "TR_code"
        }
    },
    St_description_reception_status: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    St_contact: {
        type: DataTypes.STRING(40),
        allowNull: true
    },
    St_contact_phone: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    St_requester: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    St_socioeconomic_status: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    St_code_synagogue: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: "synagogue",
            key: "Sy_code"
        }
    },
    St_code_frequency: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: "frequency",
            key: "Fr_code"
        }
    },
    St_amount_frequency: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    St_name_school_bein_hazmanim: {
        type: DataTypes.STRING(40),
        allowNull: true
    },
    St_nusah_tfila: {
        type: DataTypes.STRING(40),
        allowNull: true
    }
    ,
    St_veshinantem: {
        type: DataTypes.STRING(40),
        allowNull: true
    }
    ,
    St_hebrew_date: {
        type: DataTypes.STRING(40),
        allowNull: true
    },
    St_reception_date: {
        type: DataTypes.STRING(10),
        allowNull: true
    }
}, {
    tableName: "student",
    timestamps: false
});

// הגדרת הקשרים בין הישויות ב-Sequelize
Student.associate = function (models) {
    Student.belongsTo(models.TypeGender, { foreignKey: "St_gender" });
    Student.belongsTo(models.Parent, { foreignKey: "St_father_code", as: "Father" });
    Student.belongsTo(models.Parent, { foreignKey: "St_mother_code", as: "Mother" });
    Student.belongsTo(models.City, { foreignKey: "St_city_code" });
    Student.belongsTo(models.Worker, { foreignKey: "St_worker_code" });
    Student.belongsTo(models.TypeActivityState, { foreignKey: "St_activity_status" });
    Student.belongsTo(models.TypeRisk, { foreignKey: "St_risk_code" });
    Student.belongsTo(models.Synagogue, { foreignKey: "St_code_synagogue" });
    Student.belongsTo(models.Frequency, { foreignKey: "St_code_frequency" });
};

module.exports = Student;
