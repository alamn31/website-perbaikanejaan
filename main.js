const express = require("express");
const mysql = require("mysql");

const app = express();

app.set("view engine", "ejs");
app.use("/views", express.static("views"));

const db = mysql.createConnection({
  host: "localhost",
  database: "kamus_sinonim",
  user: "root",
  password: "",
});

db.connect((err) => {
  if (err) throw err;

  const sql1 = "SELECT * FROM kamussinonim";
  const sql2 = "SELECT * FROM judulskripsi";

  db.query(sql1, (err, result1) => {
    if (err) throw err;

    db.query(sql2, (err, result2) => {
      if (err) throw err;

      const users = JSON.parse(JSON.stringify(result1));
      const judul = JSON.parse(JSON.stringify(result2));

      app.get("/", (req, res) => {
        res.render("index", { users: users, judul: judul });
      });
    });
  });
});

app.get("/informatika", (req, res) => {
  const query = `SELECT * FROM judulskripsi WHERE Penerbit like "Informatika" `;
  db.query(query, (err, results) => {
    if (err) {
      throw err;
    }
    res.send(results);
  });
});

app.get("/TeknikArsitektur", (req, res) => {
  const query = `SELECT * FROM judulskripsi WHERE Penerbit like "Teknik Arsitektur" `;
  db.query(query, (err, results) => {
    if (err) {
      throw err;
    }
    res.send(results);
  });
});

app.get("/TeknikElektro", (req, res) => {
  const query = `SELECT * FROM judulskripsi WHERE Penerbit like "Teknik Elektro" `;
  db.query(query, (err, results) => {
    if (err) {
      throw err;
    }
    res.send(results);
  });
});

app.get("/TeknikSipil", (req, res) => {
  const query = `SELECT * FROM judulskripsi WHERE Penerbit like "Teknik Sipil" `;
  db.query(query, (err, results) => {
    if (err) {
      throw err;
    }
    res.send(results);
  });
});

app.listen(5000, () => {
  console.log("server ready...");
});
