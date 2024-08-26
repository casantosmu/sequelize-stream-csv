import fs from "node:fs";
import { pipeline } from "node:stream";
import fastCsv from "fast-csv";
import { sequelize } from "./db.js";
import { createSequelizeStream } from "./sequelize-stream.js";

try {
  const fileStream = fs.createWriteStream("./output.csv");
  const csvStream = fastCsv.format({
    headers: ["id", "name", "email", "age", "createdAt", "updatedAt"],
    transform: (row) => {
      row.createdAt = new Date(row.created_at).toISOString();
      row.updatedAt = new Date(row.updated_at).toISOString();
      return row;
    },
  });
  const pgStream = await createSequelizeStream(
    "SELECT * FROM users WHERE created_at < :createdAt",
    { createdAt: new Date() },
  );

  await new Promise((resolve, reject) => {
    pipeline(pgStream, csvStream, fileStream, (error) => {
      if (error) {
        console.error("Error during streaming to CSV:", error);
        reject(error);
        return;
      }
      console.log("Streaming to CSV complete.");
      resolve();
    });
  });

  sequelize.close();
} catch (error) {
  console.error("Error during streaming to CSV:", error);
  process.exit(1);
}
