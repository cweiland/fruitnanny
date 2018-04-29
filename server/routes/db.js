const router = require("express").Router();
const db = require("../db");

/* /api/naps */
router.get("/", (req, res) => {
  db.query('SELECT * FROM naps')
    .then((data, err) => res.send(data.rows));
});

router.post("/", (req, res) => {
  db.query('INSERT INTO naps (data) VALUES ($1) RETURNING *', [JSON.stringify(req.body)])
    .then(data => res.send(data.rows[0]));
});

exports.default = router;