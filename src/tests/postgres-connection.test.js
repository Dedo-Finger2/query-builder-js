/* eslint-disable no-undef */
import { describe, expect, it } from "vitest";
import { PostgresConnection } from "../core/postgres-connection";
import "dotenv/config";

const makeConnection = () => {
  const connectionProps = {
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
  };
  const connection = new PostgresConnection(connectionProps);
  return {
    connection,
    connectionProps,
  };
};

describe("PostgreSQLConnection class", () => {
  it("should not throw when using sut.query", async () => {
    const { connection } = makeConnection();
    await connection.query("CREATE TABLE IF NOT EXISTS users");

    const sut = connection.query("SELECT * FROM users");

    await expect(sut).resolves.not.toThrow();
  });
});
