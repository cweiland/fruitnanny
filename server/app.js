

Object.defineProperty(exports, "__esModule", { value: true });
const config = require("../fruitnanny_config");
const express = require("express");
const dht = require("./routes/dht");
const light = require("./routes/light");
const db = require("./routes/db");

const app = express();
app.use(express.static("build"));
app.use(express.json());
app.use("/api/light", light.default);
app.use("/api/dht", dht.default);
app.use("/api/naps", db.default);

// Postgresql
const { Client } = require("pg");

const client = new Client({
  connectionString: "postgresql://pi:fruitnanny@localhost:5432/fruitnanny"
});

client.connect(() => console.log("Connected to postgresql"));

app.listen(7000, () => {
  console.log("Fruitnanny app listening on port 7000!");
});
