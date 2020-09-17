const winston = require("winston");

module.exports = function (handler) {
  return async (req, res) => {
    {
      try {
        await handler(req, res);
      } catch (err) {
        winston.error(err.message, err);
        res.status(500).send(err.message);
      }
    }
  };
};
