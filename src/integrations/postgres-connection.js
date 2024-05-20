import { Connection } from "../core/connection.js";
import postgresDriver from "pg";

const { Pool } = postgresDriver;

export class PostgresConnection extends Connection {
  pool;

  constructor({ user, host, password, database, port, urlConnection }) {
    super({
      user,
      host,
      password,
      database,
      port,
      urlConnection,
    });
  }

  #createConnection() {
    this.pool = new Pool({
      host: this.host,
      user: this.user,
      password: this.password,
      database: this.database,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
      port: this.port,
    });
  }

  async query(query) {
    try {
      this.#createConnection();
      const client = await this.pool.connect();
      try {
        const response = await client.query(query);
        return response.rows;
      } catch (error) {
        console.error(error);
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("Erro ao executar a query", error.stack);
    } finally {
      await this.pool.end();
    }
  }
}
