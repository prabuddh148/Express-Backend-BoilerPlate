import { Sequelize } from "sequelize";
import { Umzug, SequelizeStorage } from "umzug";
import { DB_CONFIG } from "./src/config/config.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV || "development";
const config = DB_CONFIG[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: false
  }
);

const seeder = new Umzug({
  migrations: {
    // glob: path.join(__dirname, "src/database/seeders/*.js"),
    // glob: path.join(__dirname, "seeders/*.js"),
    glob: path.join(__dirname, "database/seeders/*.js"),
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({
    sequelize,
    modelName: "seeders_meta"
  }),
  logger: console,
});

async function runSeeders() {
  try {
    await sequelize.authenticate();
    console.log("Database connected!");

    const seeds = await seeder.up();
    console.log("Seeders completed:", seeds.map(s => s.name));
  } catch (err) {
    console.error("Seeder failed:", err);
  } finally {
    await sequelize.close();
  }
}

runSeeders();
