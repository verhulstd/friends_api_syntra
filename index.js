import express from "express";
import mysql2 from "mysql2";
import morgan from "morgan";
import * as url from "url";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const db = mysql2.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "fe_01",
  timezone: "+02:00",
  dateStrings: "date",
});

const server = express();
server.use(morgan("dev"));
server.use(express.static("public"));
server.use(express.json());

server.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

server.get("/friends", function (req, res) {
  db.query("SELECT * FROM friends;", function (error, results) {
    if (!error) {
      res.json(results);
    }
  });
});

server.get("/friends/:id", function (req, res) {
  const ids = req.params.id;
  db.query(
    `SELECT * FROM friends WHERE id IN (${ids});`,
    function (error, results) {
      if (!error) {
        console.log(results);
        res.json(results);
      }
    }
  );
});

// server.get("/boodschap", function (req, res) {
//   // via http://localhost:1234/boodschap?naam=david&leeftijd=42
//   console.log(req.query.leeftijd); // 42
// });

server.delete("/friends/:id", function (req, res) {
  const id = req.params.id;
  db.query(
    "DELETE FROM friends WHERE id = " + id + ";",
    function (error, results) {
      console.log(error);
      if (!error) {
        res.json({ delete: "success" });
      }
    }
  );
});

server.put("/friends/:id", function (req, res) {
  const id = req.params.id;
  const newName = req.body.name;
  const newDate = req.body.birthdate;
  const sql = `UPDATE friends SET name="${newName}", birthdate="${newDate}" WHERE id = ${id}`;
  db.query(sql, (error, results) => {
    if (!error) {
      res.json({ update: "success" });
    }
  });
});

server.post("/friends", function (req, res) {
  const newName = req.body.name;
  const newDate = req.body.birthdate;
  const sql = `insert into friends values(null, "${newName}", "${newDate}");`;
  console.log(sql);
  db.query(sql, function (error, results) {
    if (!error) {
      res.json({ insert: "success" });
    }
  });
});

server.listen(1234, function () {
  console.log("Your server is running @ localhost:1234");
});
