export class QueryBuilder {
  client;
  connection;

  constructor({ client, connection }) {
    this.client = client;
    this.connection = connection;
  }
}
