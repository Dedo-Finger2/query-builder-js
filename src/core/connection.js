export class Connection {
  /** @type {string} */
  host;
  /** @type {string} */
  user;
  /** @type {string} */
  password;
  /** @type {string} */
  database;
  /** @type {number} */
  port;
  /** @type {string} */
  urlConnection;

  /**
   * @param {{ host: string, user: string, password: string, database: string, port: number, urlConnection: string|undefined }}
   */
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
