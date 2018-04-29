const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://pi:fruitnanny@localhost:5432/fruitnanny'
});

module.exports = {
  query: (text, params) => pool.query(text, params)
}

// TODO: move to routes/db.js
