import { DataTypes } from "sequelize";

export const up = async ({ context: queryInterface }) => {
  await queryInterface.createTable("users_otp_details", {
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
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },

    otp_hash: {
      type: DataTypes.STRING,
      allowNull: true,
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

    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    updated_at: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    deleted_at: {
      allowNull: true,
      type: DataTypes.DATE,
    },
  });
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("users_otp_details");
};
