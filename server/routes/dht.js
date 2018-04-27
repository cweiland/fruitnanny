"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cp = require("child_process");
let router = express.Router();
router.get("/current", (req, res, next) => {
    cp.exec("bin/dht22.py", (err, stdout, stderr) => {
        let [temperature, humidity] = stdout.split(" ");
        res.json({ temperature, humidity });
    });
});
exports.default = router;
