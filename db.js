const sqlite3 = reequire('sqlite3').verbose();
const db = new sqlite3.Database('someFile');

db.serialize(() =>{
    //Table of existing users
    db.run("CREATE TABLE IF NO EXISTS users ( \
        id INTEGER PRIMARY KEY, \
        username TEXT UNIQUE, \
        hashed_password BLOB, \
        salt BLOB, \
        name TEXT \
    ) ");

    //User federated credentials table
    db.run("CREATE TABLE IF NO EXISTS federated_credentials \
        id INTEGER PRIMARY KEY, \
        user_id INTEGER NOT NULL, \
        provider TEXT NOT NULL, \
        subject TEXT NOT NULL, \
        UNIQUE (provider, subject) \
    ");

    //User stats table
    db.run("CREATE TABLE IF NO EXISTS stats \
        id INTEGER PRIMARY KEY, \
        score REAL, \
        games INTEGER \
    ");
});

module.exports = db;
