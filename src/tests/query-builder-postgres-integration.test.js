/* eslint-disable no-undef */
import { describe, expect, it } from "vitest";
import { PostgresConnection } from "../integrations/postgres-connection.js";
import { QueryBuilder } from "../core/query-builder.js";
import "dotenv/config";

const makeSut = () => {
  const connectionProps = {
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
  };
  const connection = new PostgresConnection(connectionProps);
  const queryBuilderProps = {
    client: "postgresql",
    connection,
  };
  const queryBuilder = new QueryBuilder(queryBuilderProps);
  return {
    connectionProps,
    queryBuilderProps,
    queryBuilder,
    connection,
  };
};

describe("QueryBuilder PostgreSQL integration", () => {
  it("should return a list of users", async () => {
    const { queryBuilder, connection } = makeSut();
    const tableName = "users";
    const query = queryBuilder.table(tableName).select()._query;

    const users = await connection.query(query);

    expect(users.length).toBeGreaterThan(0);
  });

  it("should return a list of users with age above 30", async () => {
    const { queryBuilder, connection } = makeSut();
    const tableName = "users";
    const whereProps = [
      {
        column: "age",
        operator: ">",
        value: 30,
      },
    ];
    const query = queryBuilder
      .table(tableName)
      .select()
      .where(whereProps)._query;

    const users = await connection.query(query);

    expect(users.length).toBeGreaterThan(0);
  });

  it("should return a list of users with name like Joh", async () => {
    const { queryBuilder, connection } = makeSut();
    const tableName = "users";
    const whereProps = [
      {
        column: "name",
        operator: "LIKE",
        value: "%Joh%",
      },
    ];
    const query = queryBuilder
      .table(tableName)
      .select()
      .where(whereProps)._query;
    console.log(query);
    const users = await connection.query(query);

    expect(users.length).toBeGreaterThan(0);
  });

  it("should return a list of orders of the users named John Doe", async () => {
    const { queryBuilder, connection } = makeSut();
    const tableName = "users";
    const whereProps = [
      {
        column: "name",
        operator: "LIKE",
        value: "%Joh%",
      },
    ];
    const joinProps = [
      {
        joinOrientation: "INNER JOIN",
        table: "orders",
        otherTableProperty: "user_id",
        operator: "=",
        thisTableProperty: "id",
      },
    ];
    const query = queryBuilder
      .table(tableName)
      .select()
      .join(joinProps)
      .where(whereProps)._query;

    const users = await connection.query(query);

    expect(users.length).toBeGreaterThan(0);
  });

  it("should return a list of orders limited by 1 of the users named John Doe", async () => {
    const { queryBuilder, connection } = makeSut();
    const tableName = "users";
    const whereProps = [
      {
        column: "name",
        operator: "LIKE",
        value: "%Joh%",
      },
    ];
    const joinProps = [
      {
        joinOrientation: "INNER JOIN",
        table: "orders",
        otherTableProperty: "user_id",
        operator: "=",
        thisTableProperty: "id",
      },
    ];
    const query = queryBuilder
      .table(tableName)
      .select()
      .join(joinProps)
      .where(whereProps)
      .limit(1)._query;

    const users = await connection.query(query);

    expect(users.length).toBe(1);
  });

  it("should return a list of users grouped by age", async () => {
    const { queryBuilder, connection } = makeSut();
    const tableName = "users";
    const whereProps = [
      {
        column: "name",
        operator: "LIKE",
        value: "%Joh%",
      },
    ];
    const joinProps = [
      {
        joinOrientation: "INNER JOIN",
        table: "orders",
        otherTableProperty: "user_id",
        operator: "=",
        thisTableProperty: "id",
      },
    ];
    const query = queryBuilder
      .table(tableName)
      .select(["users.age", "COUNT(orders.id) AS order_count"])
      .join(joinProps)
      .where(whereProps)
      .groupBy(["users.age"])._query;

    const users = await connection.query(query);

    expect(users.length).toBeGreaterThan(0);
  });

  it("should return a list of users from youngest to oldest", async () => {
    const { queryBuilder, connection } = makeSut();
    const tableName = "users";
    const orderByProps = [{ column: "age", orientation: "ASC" }];
    const query = queryBuilder
      .table(tableName)
      .select(["name", "age"])
      .orderBy(orderByProps)._query;

    const users = await connection.query(query);

    expect(users.length).toBeGreaterThan(0);
    expect(users[0].age).toBe(12);
  });

  it("should return a list of users grouped by age", async () => {
    const { queryBuilder, connection } = makeSut();
    const tableName = "users";
    const joinProps = [
      {
        joinOrientation: "INNER JOIN",
        table: "orders",
        otherTableProperty: "user_id",
        operator: "=",
        thisTableProperty: "id",
      },
    ];
    const query = queryBuilder
      .table(tableName)
      .select(["users.name", "SUM(orders.quantity) AS order_quantity"])
      .join(joinProps)
      .groupBy(["users.name"])._query;

    const users = await connection.query(query);

    expect(users.length).toBeGreaterThan(0);
  });

  it("should insert a new user", async () => {
    const { queryBuilder, connection } = makeSut();
    const tableName = "users";
    const insertProps = {
      name: "fake_name",
      email: "fake_email",
      age: 12,
    };
    const query = queryBuilder.table(tableName).insert(insertProps)._query;

    const promiseResponse = connection.query(query);

    await expect(promiseResponse).resolves.not.toThrow();
  });

  it("should update user's age where user id = 1", async () => {
    const { queryBuilder, connection } = makeSut();
    const tableName = "users";
    const updateProps = [{ column: "age", newValue: 12 }];
    const whereProps = [
      {
        column: "id",
        value: 1,
      },
    ];
    const query = queryBuilder
      .table(tableName)
      .update(updateProps)
      .where(whereProps)._query;

    await connection.query(query);
    const user = await connection.query("SELECT * FROM users WHERE id = 1;");

    expect(user[0].age).toBe(12);
  });

  it("should delete the order with id 2", async () => {
    const { queryBuilder, connection } = makeSut();
    const tableName = "orders";
    const whereProps = [
      {
        column: "id",
        value: 1,
      },
    ];
    const query = queryBuilder
      .table(tableName)
      .delete()
      .where(whereProps)._query;

    await connection.query(query);
    const user = await connection.query("SELECT * FROM orders WHERE id = 1;");

    expect(user[0]).toBeUndefined();
  });

  it("should return a list of users with age between 20 and 25", async () => {
    const { queryBuilder, connection } = makeSut();
    const tableName = "users";
    const whereProps = [
      {
        column: "age",
        operator: "BETWEEN",
        value: [20, 25],
      },
    ];
    const query = queryBuilder
      .table(tableName)
      .select()
      .where(whereProps)._query;
    console.log(query);
    const users = await connection.query(query);

    expect(users.length).toBeGreaterThan(0);
  });

  it("should return a list of users with age in a list of ages", async () => {
    const { queryBuilder, connection } = makeSut();
    const tableName = "users";
    const whereProps = [
      {
        column: "age",
        operator: "IN",
        value: [12, 25, 35],
      },
    ];
    const query = queryBuilder
      .table(tableName)
      .select()
      .where(whereProps)._query;

    const users = await connection.query(query);

    expect(users.length).toBeGreaterThan(0);
  });

  it("should return a list of users paginated using offset and limit clausules", async () => {
    const { queryBuilder, connection } = makeSut();
    const tableName = "users";
    const query = queryBuilder
      .table(tableName)
      .select()
      .limit(2)
      .offset(0)._query;

    const users = await connection.query(query);
    const next2Users = await connection.query(
      "SELECT * FROM users LIMIT 2 OFFSET 2",
    );

    expect(users.length).toBe(2);
    expect(users[0].id).toBe(2);
    expect(users[1].id).toBe(3);
    expect(next2Users.length).toBe(2);
    expect(next2Users[0].id).toBe(4);
    expect(next2Users[1].id).toBeTruthy();
  });

  it("should return a list of users where not age === 25", async () => {
    const { queryBuilder, connection } = makeSut();
    const tableName = "users";
    const notWhereProps = {
      age: {
        operator: "=",
        value: 25,
      },
    };
    const query = queryBuilder
      .table(tableName)
      .select()
      .notWhere(notWhereProps)._query;

    const users = await connection.query(query);

    expect(users.length).toBeGreaterThan(0);
  });
});
