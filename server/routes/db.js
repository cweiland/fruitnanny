const router = require("express").Router();
const db = require("../db");

/* /api/naps */
router.get("/", (req, res) => {
  db.query('SELECT * FROM naps')
    .then((data, err) => res.send(data.rows.map(row => row.data)));
});

router.post("/", (req, res) => {
  db.query('INSERT INTO naps (data) VALUES ($1) RETURNING *', [JSON.stringify(req.body)])
    .then(data => res.send(data.rows[0]));
});

router.get("/timer", (req, res) => {
  db.query('SELECT * FROM timer')
    .then((data, err) => {
      console.log(data.rows);
      res.send(data && data.rows.length > 0 ? data.rows[0] : {status: 'empty'})
    })
})

router.post("/timer", (req, res) => {
  db.query('INSERT INTO timer (time) VALUES ($1)', [req.body.time])
    .then(() => res.send(JSON.stringify({ status: 'ok' })));
});

router.delete("/timer", (req, res) => {
  db.query('DELETE * FROM timer', [req.body.time])
    .then(data => res.send(JSON.stringify({ status: 'ok' })));
});

exports.default = router;