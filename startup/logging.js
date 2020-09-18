const config = require("config");
const winston = require("winston");
require("winston-mongodb");
module.exports = () => {
  winston.handleExceptions(
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );

  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

  winston.add(winston.transports.File, { filename: "logfile.log" });
  winston.add(winston.transports.MongoDB, {
    db: `${config.get("dbString")}`,
    level: "error",
  });
};
