export class Connection {
  host;
  user;
  password;
  database;
  port;
  urlConnection;

  constructor({
    host,
    user,
    password,
    database,
    port,
    urlConnection = undefined,
  }) {
    this.database = database;
    this.user = user;
    this.password = password;
    this.host = host;
    this.port = port;
    this.urlConnection = urlConnection;
  }
}
