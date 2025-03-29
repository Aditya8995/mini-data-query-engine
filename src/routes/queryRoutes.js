const express = require("express");
const db = require("../db");

const router = express.Router();


router.post("/query", (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: "Question is required" });

  const pseudoSQL = `SELECT * FROM data WHERE condition = '${question}'`;

  db.get("SELECT * FROM queries WHERE query = ?", [question], (err, row) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (row) {
      return res.json({ message: "Query already exists", question, pseudoSQL: row.pseudo_sql });
    }

    db.run("INSERT INTO queries (query, pseudo_sql) VALUES (?, ?)", [question, pseudoSQL], (err) => {
      if (err) return res.status(500).json({ error: "Failed to store query" });

      res.json({ message: "Query processed successfully", question, pseudoSQL });
    });
  });
});

router.get("/explain", (req, res) => {
  res.json({
    message: "This endpoint explains the query processing steps",
    steps: [
      "Receive natural language query",
      "Convert it into a pseudo-SQL query",
      "Store it in the database",
      "Return the generated pseudo-SQL"
    ]
  });
});

router.get("/validate", (req, res) => {
  const { question } = req.query;
  if (!question) return res.status(400).json({ error: "Query is required" });

  db.get("SELECT pseudo_sql FROM queries WHERE query = ?", [question], (err, row) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (!row) return res.status(404).json({ message: "Query not found" });

    res.json({ question, pseudoSQL: row.pseudo_sql, valid: true });
  });
});

router.get("/all-queries", (req, res) => {
  db.all("SELECT * FROM queries", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });

    res.json({ queries: rows });
  });
});

module.exports = router;
