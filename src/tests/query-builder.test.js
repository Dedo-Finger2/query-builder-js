/* eslint-disable no-undef */
import { describe, expect, it } from "vitest";
import { Connection } from "../core/connection.js";
import { QueryBuilder } from "../core/query-builder.js";
import { PostgresConnection } from "../core/postgres-connection.js";
import "dotenv/config";

const makeSut = () => {
  const connectionProps = {
    host: "fake_host",
    user: "fake_user",
    password: "fake_password",
    database: "fake_database",
  };
  const queryBuilderProps = {
    client: "fake_client",
    connection: new Connection(connectionProps),
  };
  const queryBuilder = new QueryBuilder(queryBuilderProps);
  return {
    connectionProps,
    queryBuilderProps,
    queryBuilder,
  };
};

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

// beforeAll(async () => {
//   const { connection } = makeConnection();
//   const createUsersTable = "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name VARCHAR(100), email VARCHAR(100), age INT);";
//   const createOrdersTable = "CREATE TABLE IF NOT EXISTS orders (id SERIAL PRIMARY KEY, user_id INT REFERENCES users(id), product_name VARCHAR(100), quantity INT);";
//   const insertUsersData = "INSERT INTO users (name, email, age) VALUES ('John Doe', 'john@example.com', 30), ('Jane Smith', 'jane@example.com', 25), ('Alice Johnson', 'alice@example.com', 35);";
//   const insertOrdersData = "INSERT INTO orders (user_id, product_name, quantity) VALUES (1, 'Product 1', 2), (2, 'Product 2', 1), (3, 'Product 3', 3);";
//   await connection.query(createUsersTable);
//   await connection.query(createOrdersTable);
//   await connection.query(insertUsersData);
//   await connection.query(insertOrdersData);
// });

describe("QueryBuilder Class", () => {
  it("should create a new query builder", () => {
    const { queryBuilder, connectionProps, queryBuilderProps } = makeSut();

    expect(queryBuilder).toBeInstanceOf(QueryBuilder);
    expect(queryBuilder.connection.host).toBe(connectionProps.host);
    expect(queryBuilder.client).toBe(queryBuilderProps.client);
  });

  it("should set the table when calling queryBuilder.table", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";

    queryBuilder.table(tableName);

    expect(queryBuilder._table).toBe(tableName);
  });

  it("should return an INSERT query string when calling queryBuilder.table.insert._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";
    const insertProps = {
      name: "fake_name",
      email: "fake_email",
      password: "fake_password",
    };

    const query = queryBuilder.table(tableName).insert(insertProps)._query;

    expect(query).toBe(
      "INSERT INTO fake_table_name (name,email,password) VALUES ('fake_name','fake_email','fake_password')",
    );
  });

  it("should return a SELECT query string when calling queryBuilder.table.select._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";
    const selectProps = ["id", "name", "email"];

    const query = queryBuilder.table(tableName).select(selectProps)._query;

    expect(query).toBe("SELECT id,name,email FROM fake_table_name");
  });

  it("should set columns to * by default using queryBuilder.table.select._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";

    const query = queryBuilder.table(tableName).select()._query;

    expect(query).toBe("SELECT * FROM fake_table_name");
  });

  it("should return a SELECT query string with where clause when calling queryBuilder.table.select._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";
    const whereProps = {
      name: {
        value: "fake_name",
      },
    };

    const query = queryBuilder
      .table(tableName)
      .select()
      .where(whereProps)._query;

    expect(query).toBe("SELECT * FROM fake_table_name WHERE name='fake_name'");
  });

  it("should return a SELECT query string with multiple where clause when calling queryBuilder.table.select._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";
    const whereProps = {
      name: {
        value: "fake_name",
      },
      email: {
        value: "fake_email",
      },
      age: {
        value: 1,
      },
    };

    const query = queryBuilder
      .table(tableName)
      .select()
      .where(whereProps)._query;

    expect(query).toBe(
      "SELECT * FROM fake_table_name WHERE name='fake_name' AND email='fake_email' AND age=1",
    );
  });

  it("should return a SELECT query string with where clause using LIKE when calling queryBuilder.table.select._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";
    const whereProps = {
      name: {
        value: "%fake_name%",
        operator: "LIKE",
      },
      email: {
        value: "fake_email",
      },
      age: {
        value: 1,
      },
    };

    const query = queryBuilder
      .table(tableName)
      .select()
      .where(whereProps)._query;

    expect(query).toBe(
      "SELECT * FROM fake_table_name WHERE name LIKE '%fake_name%' AND email='fake_email' AND age=1",
    );
  });

  it("should return a SELECT query string with where clause using any operator when calling queryBuilder.table.select._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";
    const whereProps = {
      name: {
        value: "fake_name",
      },
      email: {
        value: "fake_email",
      },
      age: {
        value: 1,
        operator: ">",
      },
      fingers: {
        value: 9,
        operator: "<=",
      },
    };

    const query = queryBuilder
      .table(tableName)
      .select()
      .where(whereProps)._query;

    expect(query).toBe(
      "SELECT * FROM fake_table_name WHERE name='fake_name' AND email='fake_email' AND age > 1 AND fingers <= 9",
    );
  });

  it("should return a SELECT query string with orderBy clause on queryBuilder.table.select._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";
    const whereProps = {
      name: {
        value: "fake_name",
      },
      email: {
        value: "fake_email",
      },
      age: {
        value: 1,
      },
    };
    const orderByProps = [{ column: "name", orientation: "ASC" }];

    const query = queryBuilder
      .table(tableName)
      .select()
      .where(whereProps)
      .orderBy(orderByProps)._query;

    expect(query).toBe(
      "SELECT * FROM fake_table_name WHERE name='fake_name' AND email='fake_email' AND age=1 ORDER BY name ASC",
    );
  });

  it("should return a SELECT query string with multiple orderBy clauses on queryBuilder.table.select._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";
    const whereProps = {
      name: {
        value: "fake_name",
      },
      email: {
        value: "fake_email",
      },
      age: {
        value: 1,
      },
    };
    const orderByProps = [
      { column: "name", orientation: "ASC" },
      { column: "email", orientation: "DESC" },
      { column: "age" },
    ];

    const query = queryBuilder
      .table(tableName)
      .select()
      .where(whereProps)
      .orderBy(orderByProps)._query;

    expect(query).toBe(
      "SELECT * FROM fake_table_name WHERE name='fake_name' AND email='fake_email' AND age=1 ORDER BY name ASC,email DESC,age ASC",
    );
  });

  it("should return a SELECT query string using having clause on queryBuilder.table.select._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";
    const whereProps = {
      name: {
        value: "fake_name",
      },
      email: {
        value: "fake_email",
      },
      age: {
        value: 1,
      },
    };
    const havingProps = [{ field: "COUNT(id)", operator: ">", value: 1 }];

    const query = queryBuilder
      .table(tableName)
      .select()
      .where(whereProps)
      .having(havingProps)._query;

    expect(query).toBe(
      "SELECT * FROM fake_table_name WHERE name='fake_name' AND email='fake_email' AND age=1 HAVING COUNT(id) > 1",
    );
  });

  it("should return a SELECT query string using multiple having clause on queryBuilder.table.select._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";
    const whereProps = {
      name: {
        value: "fake_name",
      },
      email: {
        value: "fake_email",
      },
      age: {
        value: 1,
      },
    };
    const havingProps = [
      { field: "COUNT(id)", operator: ">", value: 1 },
      { field: "COUNT(name)", operator: "<", value: 1 },
      { field: "COUNT(age)", value: 1 },
    ];

    const query = queryBuilder
      .table(tableName)
      .select()
      .where(whereProps)
      .having(havingProps)._query;

    expect(query).toBe(
      "SELECT * FROM fake_table_name WHERE name='fake_name' AND email='fake_email' AND age=1 HAVING COUNT(id) > 1 AND COUNT(name) < 1 AND COUNT(age)=1",
    );
  });

  it("should return a SELECT query string using limit clause on queryBuilder.table.select._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";
    const whereProps = {
      name: {
        value: "fake_name",
      },
      email: {
        value: "fake_email",
      },
      age: {
        value: 1,
      },
    };

    const query = queryBuilder
      .table(tableName)
      .select()
      .where(whereProps)
      .limit(10)._query;

    expect(query).toBe(
      "SELECT * FROM fake_table_name WHERE name='fake_name' AND email='fake_email' AND age=1 LIMIT 10",
    );
  });

  it("should return a SELECT query string using offset clause on queryBuilder.table.select._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";
    const whereProps = {
      name: {
        value: "fake_name",
      },
      email: {
        value: "fake_email",
      },
      age: {
        value: 1,
      },
    };

    const query = queryBuilder
      .table(tableName)
      .select()
      .where(whereProps)
      .limit(10)
      .offset(2)._query;

    expect(query).toBe(
      "SELECT * FROM fake_table_name WHERE name='fake_name' AND email='fake_email' AND age=1 LIMIT 10 OFFSET 2",
    );
  });

  it("should return a SELECT query string using group by clause on queryBuilder.table.select._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";
    const whereProps = {
      name: {
        value: "fake_name",
      },
      email: {
        value: "fake_email",
      },
      age: {
        value: 1,
      },
    };
    const groupByProps = ["name", "email"];

    const query = queryBuilder
      .table(tableName)
      .select()
      .where(whereProps)
      .groupBy(groupByProps)._query;

    expect(query).toBe(
      "SELECT * FROM fake_table_name WHERE name='fake_name' AND email='fake_email' AND age=1 GROUP BY name,email",
    );
  });

  it("should return a UPDATE query string on queryBuilder.table.update._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";
    const updateProps = [
      { column: "name", newValue: "new_fake_name" },
      { column: "age", newValue: 12 },
      { column: "email", newValue: "new_fake_email" },
    ];

    const query = queryBuilder.table(tableName).update(updateProps)._query;

    expect(query).toBe(
      "UPDATE fake_table_name SET name = 'new_fake_name', age = 12, email = 'new_fake_email'",
    );
  });

  it("should return a UPDATE query string with where clause on queryBuilder.table.update._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";
    const updateProps = [
      { column: "name", newValue: "new_fake_name" },
      { column: "age", newValue: 12 },
      { column: "email", newValue: "new_fake_email" },
    ];
    const whereProps = {
      name: { value: "fake_name" },
      email: { value: "fake_email" },
      age: { value: 1 },
    };

    const query = queryBuilder
      .table(tableName)
      .update(updateProps)
      .where(whereProps)._query;

    expect(query).toBe(
      "UPDATE fake_table_name SET name = 'new_fake_name', age = 12, email = 'new_fake_email' WHERE name='fake_name' AND email='fake_email' AND age=1",
    );
  });

  it("should return a DELETE query string on queryBuilder.table.delete._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";

    const query = queryBuilder.table(tableName).delete()._query;

    expect(query).toBe("DELETE FROM fake_table_name");
  });

  it("should return a DELETE query string using where clauses on queryBuilder.table.delete._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";
    const whereProps = {
      name: { value: "fake_name" },
      email: { value: "fake_email" },
      age: { value: 1 },
    };

    const query = queryBuilder
      .table(tableName)
      .delete()
      .where(whereProps)._query;

    expect(query).toBe(
      "DELETE FROM fake_table_name WHERE name='fake_name' AND email='fake_email' AND age=1",
    );
  });

  it("should return a SELECT query string using regular JOIN on queryBuilder.table.select.join._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";
    const whereProps = {
      name: { value: "fake_name" },
      email: { value: "fake_email" },
      age: { value: 1 },
    };
    const joinProps = [
      {
        joinOrientation: "INNER JOIN",
        table: "another_fake_table",
        otherTableProperty: "id",
        operator: "=",
        thisTableProperty: "id",
      },
    ];

    const query = queryBuilder
      .table(tableName)
      .select()
      .where(whereProps)
      .join(joinProps)._query;

    expect(query).toBe(
      "SELECT * FROM fake_table_name WHERE name='fake_name' AND email='fake_email' AND age=1 INNER JOIN another_fake_table ON fake_table_name.id = another_fake_table.id",
    );
  });

  it("should return a SELECT query string using multiple JOINs on queryBuilder.table.select.join.join.join._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";
    const whereProps = {
      name: { value: "fake_name" },
      email: { value: "fake_email" },
      age: { value: 1 },
    };
    const joinProps = [
      {
        joinOrientation: "LEFT JOIN",
        table: "another_fake_table_LEFT",
        otherTableProperty: "id",
        operator: "=",
        thisTableProperty: "id",
      },
      {
        joinOrientation: "RIGHT JOIN",
        table: "another_fake_table_RIGHT",
        otherTableProperty: "id",
        operator: ">",
        thisTableProperty: "id",
      },
      {
        joinOrientation: "INNER JOIN",
        table: "another_fake_table_INNER",
        otherTableProperty: "id",
        operator: "<=",
        thisTableProperty: "id",
      },
    ];

    const query = queryBuilder
      .table(tableName)
      .select()
      .where(whereProps)
      .join(joinProps)._query;

    expect(query).toBe(
      "SELECT * FROM fake_table_name WHERE name='fake_name' AND email='fake_email' AND age=1 LEFT JOIN another_fake_table_LEFT ON fake_table_name.id = another_fake_table_LEFT.id RIGHT JOIN another_fake_table_RIGHT ON fake_table_name.id > another_fake_table_RIGHT.id INNER JOIN another_fake_table_INNER ON fake_table_name.id <= another_fake_table_INNER.id",
    );
  });

  it("should return a SELECT query string using or operator on queryBuilder.table.select.orWhere._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";
    const whereProps = {
      name: {
        value: "fake_name",
      },
      email: {
        value: "fake_email",
      },
    };
    const orWhereProps = {
      age: {
        operator: ">",
        value: 1,
      },
      name: {
        value: "fake_or_name",
      },
    };

    const query = queryBuilder
      .table(tableName)
      .select()
      .where(whereProps)
      .orWhere(orWhereProps)._query;

    expect(query).toBe(
      "SELECT * FROM fake_table_name WHERE name='fake_name' AND email='fake_email' OR age > 1 OR name='fake_or_name'",
    );
  });

  it("should return a SELECT query string using where and add or operator in it on queryBuilder.table.select.where.notWhere._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";
    const whereProps = {
      name: {
        value: "fake_name",
      },
      email: {
        value: "fake_email",
      },
    };
    const notWhereProps = {
      age: {
        operator: ">",
        value: 1,
      },
      name: {
        value: "fake_or_name",
      },
    };

    const query = queryBuilder
      .table(tableName)
      .select()
      .where(whereProps)
      .notWhere(notWhereProps)._query;

    expect(query).toBe(
      "SELECT * FROM fake_table_name WHERE name='fake_name' AND email='fake_email' NOT age > 1 AND NOT name='fake_or_name'",
    );
  });

  it("should return a SELECT query string using only where not on queryBuilder.table.select.notWhere._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";
    const notWhereProps = {
      age: {
        operator: ">",
        value: 1,
      },
      name: {
        value: "fake_or_name",
      },
    };

    const query = queryBuilder
      .table(tableName)
      .select()
      .notWhere(notWhereProps)._query;

    expect(query).toBe(
      "SELECT * FROM fake_table_name WHERE NOT age > 1 AND NOT name='fake_or_name'",
    );
  });

  it("should return a SELECT query string using in operator on queryBuilder.table.select.where._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";
    const whereProps = {
      name: {
        operator: "IN",
        value: ["fake_01", "fake_02", "fake_03"],
      },
      email: {
        value: "fake_email",
      },
      age: {
        value: 1,
      },
    };

    const query = queryBuilder
      .table(tableName)
      .select()
      .where(whereProps)._query;

    expect(query).toBe(
      "SELECT * FROM fake_table_name WHERE name IN ('fake_01','fake_02','fake_03') AND email='fake_email' AND age=1",
    );
  });

  it("should return a SELECT query string using between operator on queryBuilder.table.select.where._query", () => {
    const { queryBuilder } = makeSut();
    const tableName = "fake_table_name";
    const whereProps = {
      name: {
        operator: "BETWEEN",
        value: ["fake_01", "fake_02"],
      },
      email: {
        value: "fake_email",
      },
      age: {
        value: 1,
      },
    };

    const query = queryBuilder
      .table(tableName)
      .select()
      .where(whereProps)._query;

    expect(query).toBe(
      "SELECT * FROM fake_table_name WHERE name BETWEEN 'fake_01' AND 'fake_02' AND email='fake_email' AND age=1",
    );
  });
});

describe("QueryBuilder PostgreSQL integration", () => {
  it("should return a list of users", async () => {
    const { connection } = makeConnection();
    const { queryBuilder } = makeSut();
    const tableName = "users";
    const query = queryBuilder.table(tableName).select()._query;

    const users = await connection.query(query);

    expect(users.length).toBeGreaterThan(0);
  });

  it("should return a list of users with age above 30", async () => {
    const { connection } = makeConnection();
    const { queryBuilder } = makeSut();
    const tableName = "users";
    const whereProps = {
      age: {
        operator: ">",
        value: 30,
      },
    };
    const query = queryBuilder
      .table(tableName)
      .select()
      .where(whereProps)._query;

    const users = await connection.query(query);

    expect(users.length).toBeGreaterThan(0);
  });

  it("should return a list of users with name like Joh", async () => {
    const { connection } = makeConnection();
    const { queryBuilder } = makeSut();
    const tableName = "users";
    const whereProps = {
      name: {
        operator: "LIKE",
        value: "%Joh%",
      },
    };
    const query = queryBuilder
      .table(tableName)
      .select()
      .where(whereProps)._query;

    const users = await connection.query(query);

    expect(users.length).toBeGreaterThan(0);
  });

  it("should return a list of orders of the users named John Doe", async () => {
    const { connection } = makeConnection();
    const { queryBuilder } = makeSut();
    const tableName = "users";
    const whereProps = {
      name: {
        operator: "LIKE",
        value: "%Joh%",
      },
    };
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
    const { connection } = makeConnection();
    const { queryBuilder } = makeSut();
    const tableName = "users";
    const whereProps = {
      name: {
        operator: "LIKE",
        value: "%Joh%",
      },
    };
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
    const { connection } = makeConnection();
    const { queryBuilder } = makeSut();
    const tableName = "users";
    const whereProps = {
      name: {
        operator: "LIKE",
        value: "%Joh%",
      },
    };
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
    const { connection } = makeConnection();
    const { queryBuilder } = makeSut();
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
    const { connection } = makeConnection();
    const { queryBuilder } = makeSut();
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
    const { connection } = makeConnection();
    const { queryBuilder } = makeSut();
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
    const { connection } = makeConnection();
    const { queryBuilder } = makeSut();
    const tableName = "users";
    const updateProps = [{ column: "age", newValue: 12 }];
    const whereProps = {
      id: {
        value: 1,
      },
    };
    const query = queryBuilder
      .table(tableName)
      .update(updateProps)
      .where(whereProps)._query;

    await connection.query(query);
    const user = await connection.query("SELECT * FROM users WHERE id = 1;");

    expect(user[0].age).toBe(12);
  });

  it("should delete the order with id 2", async () => {
    const { connection } = makeConnection();
    const { queryBuilder } = makeSut();
    const tableName = "orders";
    const whereProps = {
      id: {
        value: 1,
      },
    };
    const query = queryBuilder
      .table(tableName)
      .delete()
      .where(whereProps)._query;

    await connection.query(query);
    const user = await connection.query("SELECT * FROM orders WHERE id = 1;");

    expect(user[0]).toBeUndefined();
  });

  it("should return a list of users with age between 20 and 25", async () => {
    const { connection } = makeConnection();
    const { queryBuilder } = makeSut();
    const tableName = "users";
    const whereProps = {
      age: {
        operator: "BETWEEN",
        value: [20, 25],
      },
    };
    const query = queryBuilder
      .table(tableName)
      .select()
      .where(whereProps)._query;
    console.log(query);
    const users = await connection.query(query);

    expect(users.length).toBeGreaterThan(0);
  });

  it("should return a list of users with age in a list of ages", async () => {
    const { connection } = makeConnection();
    const { queryBuilder } = makeSut();
    const tableName = "users";
    const whereProps = {
      age: {
        operator: "IN",
        value: [12, 25, 35],
      },
    };
    const query = queryBuilder
      .table(tableName)
      .select()
      .where(whereProps)._query;

    const users = await connection.query(query);

    expect(users.length).toBeGreaterThan(0);
  });

  it("should return a list of users paginated using offset and limit clausules", async () => {
    const { connection } = makeConnection();
    const { queryBuilder } = makeSut();
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
    expect(next2Users[1].id).toBe(5);
  });

  it("should return a list of users where not age === 25", async () => {
    const { connection } = makeConnection();
    const { queryBuilder } = makeSut();
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
