import QueryStream from "pg-query-stream";
import pkg from "sequelize/lib/utils/sql";
import { sequelize } from "./db.js";

export const createSequelizeStream = async (sql, values) => {
  const connection = await sequelize.connectionManager.getConnection();

  try {
    sql = pkg.injectReplacements(sql, sequelize.dialect, values);
    const query = new QueryStream(sql);

    const stream = connection.query(query);

    stream.on("end", () => {
      sequelize.connectionManager.releaseConnection(connection);
      console.log("Database stream ended. Releasing connection...");
    });

    return stream;
  } catch (error) {
    console.error("Error during the creation of the database stream:", error);
    sequelize.connectionManager.releaseConnection(connection);
    throw error;
  }
};
