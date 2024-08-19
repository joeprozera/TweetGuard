const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./usernames.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS usernames (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        added_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
});

db.close();
