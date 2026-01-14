import bcrypt from "bcrypt";

export const up = async ({ context: queryInterface }) => {
  await queryInterface.bulkInsert("otp_types", [
    {
      otp_type_uuid: crypto.randomUUID(),
      otp_type: "REGISTER",
      description: "REGISTER",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },

    {
      otp_type_uuid: crypto.randomUUID(),
      otp_type: "LOGIN",
      description: "LOGIN",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },

    {
      otp_type_uuid: crypto.randomUUID(),
      otp_type: "RESET_PASSWORD",
      description: "RESET_PASSWORD",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      otp_type_uuid: crypto.randomUUID(),
      otp_type: "VERIFY_EMAIL",
      description: "VERIFY_EMAIL",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },

    {
      otp_type_uuid: crypto.randomUUID(),
      otp_type: "VERIFY_PHONE",
      description: "VERIFY_PHONE",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },

    {
      otp_type_uuid: crypto.randomUUID(),
      otp_type: "TENDER_AUTH",
      description: "TENDER_AUTH",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    
  ]);
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.bulkDelete("otp_types", null, {});
};
