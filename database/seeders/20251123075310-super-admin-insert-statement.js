import bcrypt from "bcrypt";

export const up = async ({ context: queryInterface }) => {
  await queryInterface.bulkInsert("users", [
    {
        user_uuid: crypto.randomUUID(),
        role_id: 1, // Admin
        name: "Super Admin",
        email: "admin@gvbiddercrm.com",
        password_hash: bcrypt.hashSync("Admin@123", 10),
        is_active:true,
        is_verified:true,
        created_at: new Date(),
        updated_at: new Date(),
      },
  ]);
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.bulkDelete("users", null, {});
};
