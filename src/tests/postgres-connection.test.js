/* eslint-disable no-undef */
import { describe, expect, it } from "vitest";
import { PostgresConnection } from "../core/postgres-connection";
import "dotenv/config";

describe("PostgreSQLConnection class", () => {
  it("should not throw when using sut.query", async () => {
    const connectionProps = {
      host: process.env.DB_HOST,
      password: process.env.DB_PASSWORD,
      user: process.env.DB_USER,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT,
    };
    const connection = new PostgresConnection(connectionProps);
    await connection.query("CREATE TABLE IF NOT EXISTS users");

    const sut = await connection.query("SELECT * FROM users");

    expect(sut).toEqual([]);
  });
});
