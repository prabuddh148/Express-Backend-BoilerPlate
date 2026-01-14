import { Sequelize } from "sequelize";
import { DB_CONFIG } from "../config/config.js";

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
    logging: false,
    // timezone: "+05:30",
  }
);

export default sequelize;


// import { Sequelize } from "sequelize";
// import { DB_CONFIG } from "../config/config.js";

// const env = process.env.NODE_ENV || "development";
// const config = DB_CONFIG[env];

// const sequelize = new Sequelize(
//   config.database,
//   config.username,
//   config.password,
//   {
//     host: config.host,
//     port: config.port,
//     dialect: config.dialect,
//     logging: false,
//     timezone: "+05:30"
//   }
// );

// // Test connection
// sequelize.authenticate()
//   .then(() => console.log("Connected to MySQL successfully"))
//   .catch(err => console.error("Database connection failed:", err));

// export default sequelize;
