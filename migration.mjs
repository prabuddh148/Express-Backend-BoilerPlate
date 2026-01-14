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

const migrator = new Umzug({
    migrations: {
        // glob: path.join(__dirname, "src/database/migrations/*.js"),
        // glob: path.join(__dirname, "migrations/*.js"),
        glob: path.join(__dirname, "database/migrations/*.js"),
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({
        sequelize,
        modelName: "migrations_meta"
    }),
    logger: console,
});

async function runMigrations() {
    try {
        await sequelize.authenticate();
        console.log("Database connected!");

        const migrations = await migrator.up();
        console.log("Migrations completed:", migrations.map(m => m.name));
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        await sequelize.close();
    }
}

runMigrations();