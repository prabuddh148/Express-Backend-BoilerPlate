import { DataTypes } from "sequelize";
import sequelize from "../../config/dbConfig.js";

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        user_uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        name: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(150),
            unique: true,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },

        // 🔥 Role Reference
        role_id: {
            type: DataTypes.BIGINT,
            allowNull: true,
            references: {
                model: "roles",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },

        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },

        is_verified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        timestamps: true,
        underscored: true,
        createdAt:"created_at",
        updatedAt:"updated_at",
        deletedAt:"deleted_at"
    }
);

export default User;
