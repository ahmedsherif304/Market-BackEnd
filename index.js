const express = require("express");
const winston = require("winston");
const app = express();
const morgan = require("morgan");

require("./startup/logging")();
require("./startup/config")();
require("./startup/db")();
require("./startup/routes")(app);

if (app.get("env") === "development") app.use(morgan("tiny"));
else require("./startup/prod")(app);
const port = process.env.port || 4000;
app.listen(port, () => winston.info(`listening on port ${port}...`));
