const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db/impostor.db");

db.serialize(() => {
  //Table of existing users
  db.run(
    "CREATE TABLE IF NOT EXISTS users ( \
        id INTEGER PRIMARY KEY, \
        email TEXT UNIQUE, \
        hashed_password BLOB, \
        salt BLOB, \
        name TEXT \
    )"
  );

  //User federated credentials table
  db.run(
    "CREATE TABLE IF NOT EXISTS federated_credentials ( \
        id INTEGER PRIMARY KEY, \
        user_id INTEGER NOT NULL, \
        provider TEXT NOT NULL, \
        subject TEXT NOT NULL, \
        UNIQUE (provider, subject) \
    )"
  );

  //User stats table
  db.run(
    "CREATE TABLE IF NOT EXISTS stats ( \
        id INTEGER PRIMARY KEY, \
        score REAL, \
        games INTEGER \
    )"
  );
});

module.exports = db;
