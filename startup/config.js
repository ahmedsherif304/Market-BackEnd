const config = require("config");
module.exports = () => {
  if (!config.get("jwtPrivateKey") || !config.get("saltLength")) {
    throw new Error("envirnoment variables are not set....");
  }
};
