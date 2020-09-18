const mongoose = require("mongoose");
const config = require("config");
const winston = require("winston");
module.exports = () => {
  mongoose
    .connect(`${config.get("dbString")}`)
    .then(() => winston.info("connected to database.."));
};
