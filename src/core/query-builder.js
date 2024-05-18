export class QueryBuilder {
  client;
  connection;
  tableName;

  constructor({ client, connection }) {
    this.client = client;
    this.connection = connection;
  }

  table(tableName) {
    this.tableName = tableName;
  }

  get _table() {
    return this.tableName;
  }
}
