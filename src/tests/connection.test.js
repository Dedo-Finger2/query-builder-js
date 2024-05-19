import { describe, expect, it } from "vitest";
import { Connection } from "../core/connection";

describe("Connection class", () => {
  it("should create a new connection", () => {
    const connectionProps = {
      host: "fake_host",
      user: "fake_user",
      password: "fake_password",
      database: "fake_database",
      port: 123,
    };

    const connection = new Connection(connectionProps);

    expect(connection.host).toBe(connectionProps.host);
    expect(connection.user).toBe(connectionProps.user);
    expect(connection.password).toBe(connectionProps.password);
    expect(connection.database).toBe(connectionProps.database);
    expect(connection.port).toBe(connectionProps.port);
  });
});
