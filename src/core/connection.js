export class Connection {
  host;
  user;
  password;
  database;
  urlConnection;

  constructor({ host, user, password, database, urlConnection = undefined }) {
    this.database = database;
    this.user = user;
    this.password = password;
    this.host = host;
    this.urlConnection = urlConnection;
  }
}
