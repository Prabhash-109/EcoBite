const { Sequelize } = require("sequelize");
require("dotenv").config();

const railwayDatabaseUrl =
  process.env.MYSQL_PUBLIC_URL ||
  process.env.MYSQL_URL ||
  process.env.DATABASE_URL ||
  process.env.DB_URL;

const parseDatabaseUrl = (databaseUrl) => {
  if (!databaseUrl) {
    return {};
  }

  let parsed;

  try {
    parsed = new URL(databaseUrl);
  } catch (err) {
    throw new Error("Invalid database URL. Check MYSQL_PUBLIC_URL, MYSQL_URL, DATABASE_URL, or DB_URL.");
  }

  return {
    database: parsed.pathname.replace(/^\//, ""),
    username: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    host: parsed.hostname,
    port: parsed.port,
  };
};

const urlConfig = parseDatabaseUrl(railwayDatabaseUrl);

const dbConfig = {
  database: process.env.DB_NAME || process.env.MYSQLDATABASE || urlConfig.database,
  username: process.env.DB_USER || process.env.MYSQLUSER || urlConfig.username,
  password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || urlConfig.password,
  host: process.env.DB_HOST || process.env.MYSQLHOST || urlConfig.host,
  port: process.env.DB_PORT || process.env.MYSQLPORT || urlConfig.port,
};

const missingConfig = Object.entries(dbConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingConfig.length > 0) {
  throw new Error(`Missing database configuration: ${missingConfig.join(", ")}`);
}

if (dbConfig.host.includes(".proxy.rlwy.net") && String(dbConfig.port) === "3306") {
  throw new Error(
    "Railway public MySQL proxy detected with port 3306. Use the public port from MYSQL_PUBLIC_URL instead of the internal MySQL port."
  );
}

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  port: Number(dbConfig.port),
  dialect: "mysql",
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Sequelize connected to MySQL successfully!");
  } catch (err) {
    console.error("Unable to connect to database:", err);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
