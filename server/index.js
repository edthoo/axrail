const bodyParser = require("body-parser");
const express = require("express");
const { Pool } = require("pg");

const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV === "production") {
  db = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
          rejectUnauthorized: false
      }
  })
} else {
  db = new Pool({
      user: "postgres",
      database: "axrail",
      password: "edthoo"
  })
}

const app = express();
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.get("/api/all", (req, res) => {
  db.query("SELECT json_agg(contacts) FROM contacts;", (err, dbRes) => {
    res.json(dbRes.rows[0].json_agg)
  })
});

app.post("/api/one", jsonParser, (req, res) => {
  let sql = `SELECT * FROM contacts WHERE id = ${req.body.id}`
  console.log(req.body.id)
  db.query(sql, (err, dbRes) => {
    res.json(dbRes.rows[0])
  })
});

app.post("/api/add", jsonParser, (req, res) => {
  let sql = `INSERT INTO contacts (name, country_code, phone_no)
  VALUES ('${req.body.name}', '${req.body.countryCode}', ${req.body.phoneNo});`
  db.query(sql, (err, dbRes) => {
    console.log(err)
    res.send("saved new contact")
  })
});

app.put("/api/edit", jsonParser, (req, res) => {
  let sql = `UPDATE contacts 
  SET name = '${req.body.name}', country_code = '${req.body.countryCode}', phone_no = ${req.body.phoneNo}
  WHERE id = ${req.body.id};`
  db.query(sql, (err, dbRes) => {
    console.log(err)
    console.log(dbRes)
    res.send("updated contact")
  })
});

app.delete("/api/delete", jsonParser, (req, res) => {
  let sql = `DELETE FROM contacts
  WHERE id = ${req.body.id};`
  console.log(sql)
  db.query(sql, (err, dbRes) => {
    console.log(err)
    console.log(dbRes)
    res.send("deleted contact")
  })
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});