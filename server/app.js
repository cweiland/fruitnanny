"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("../fruitnanny_config");
const dht = require("./routes/dht");
const express = require("express");
const light = require("./routes/light");

const app = express();
app.use(express.static("public"));
app.use("/api/light", light.default);
app.use("/api/dht", dht.default);

app.listen(7000, () => {
    console.log("Fruitnanny app listening on port 7000!");
});
