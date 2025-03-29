const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "database.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) throw err;
  console.log("Connected to SQLite database.");
});

db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS queries (id INTEGER PRIMARY KEY AUTOINCREMENT, query TEXT UNIQUE, pseudo_sql TEXT)"
  );
});

module.exports = db;
