export const up = async ({ context: queryInterface }) => {
  await queryInterface.bulkInsert("roles", [
    {
      role_uuid: crypto.randomUUID(),
      name: "Super Admin",
      description: "Super Admin",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      role_uuid: crypto.randomUUID(),
      name: "Bidder",
      description: "Bidder",
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.bulkDelete("roles", null, {});
};
