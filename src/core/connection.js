export class Connection {
  host;
  user;
  password;
  database;

  constructor({ host, user, password, database }) {
    this.database = database;
    this.user = user;
    this.password = password;
    this.host = host;
  }
}
