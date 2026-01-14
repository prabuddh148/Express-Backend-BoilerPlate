import { DataTypes } from "sequelize";
import sequelize from "../../config/dbConfig.js";
import OtpType from "./otpTypeModel.js";

const UsersOtpDetail = sequelize.define(
    "UsersOtpDetail",
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        users_otp_detail_uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },

        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },

        // otp: {
        //     type: DataTypes.STRING,
        //     allowNull: false,
        // },

        otp_hash: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        otp_type_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: "otp_types",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },

        expires_at: {
            allowNull: false,
            type: DataTypes.DATE,
        },

    },
    {
        tableName: "users_otp_details",
        timestamps: true,
        underScore: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        deletedAt: "deleted_at"
    }
);

OtpType.hasMany(UsersOtpDetail, { foreignKey: "otp_type_id" });
UsersOtpDetail.belongsTo(OtpType, { foreignKey: "otp_type_id" });

export default UsersOtpDetail;
