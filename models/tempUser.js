const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  type: String,
  phone: String,
  address: String,
  urlString: String,
});
const tempUser = mongoose.model("tempUser", userSchema, "tempUser");

exports.tempUser = tempUser;
