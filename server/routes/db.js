const { Pool } = require("pg");

const router = require("express").Router();

const pool = new Pool({
  connectionString: "postgresql://pi:fruitnanny@localhost:5432/fruitnanny"
});

/* /api/naps */
router.get("/", (req, res) => {
  pool
    .query("SELECT * FROM naps")
    .then(data => res.send(data.rows.map(row => row.data)));
});

router.post("/", (req, res) => {
  pool
    .query("INSERT INTO naps (data) VALUES ($1) RETURNING *", [
      JSON.stringify(req.body)
    ])
    .then(data => res.send(data.rows[0]));
});

router.get("/timer", (req, res) => {
  pool.query("SELECT * FROM timer").then(data => {
    console.log(data.rows);
    res.send(data && data.rows.length > 0 ? data.rows[0] : { status: "empty" });
  });
});

router.post("/timer", (req, res) => {
  pool
    .query("INSERT INTO timer (time) VALUES ($1)", [req.body.time])
    .then(() => res.send(JSON.stringify({ status: "ok" })));
});

router.delete("/timer", (req, res) => {
  pool
    .query("DELETE * FROM timer", [req.body.time])
    .then(() => res.send(JSON.stringify({ status: "ok" })));
});

exports.default = router;
