import { DataTypes } from "sequelize";

export const up = async ({ context: queryInterface }) => {
  await queryInterface.createTable("user_login_details", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },

    user_login_detail_uuid: {
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
      onDelete: "CASCADE",
    },
    refresh_token: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    fcm: {
      allowNull: true,
      type: DataTypes.STRING
    },
    device_id: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    device_name: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    ip_address: {
      allowNull: true,
      type: DataTypes.STRING(45)
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    deleted_at: {
      allowNull: true,
      type: DataTypes.DATE,
    },
  });
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("user_login_details");
};
