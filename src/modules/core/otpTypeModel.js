import { DataTypes } from "sequelize";
import sequelize from "../../config/dbConfig.js";

const OtpType = sequelize.define(
    "OtpType",
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },

        otp_type_uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },

        otp_type: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },

        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },

        // created_at: {
        //     allowNull: false,
        //     type: DataTypes.DATE,
        //     defaultValue: DataTypes.NOW,
        // },

        // updated_at: {
        //     allowNull: false,
        //     type: DataTypes.DATE,
        //     defaultValue: DataTypes.NOW,
        // },

        // deleted_at: {
        //     allowNull: true,
        //     type: DataTypes.DATE,
        // },
    },
    {
        tableName: "otp_types",
        timestamps: true,
        underScore: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        deletedAt: "deleted_at"
    }
);


export default OtpType;
