const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const { tempUser } = require("../models/tempUser");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const exceptionHandling = require("../middleware/exceptionHandling");
const _ = require("lodash");

router.post(
  "/",
  exceptionHandling(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const tempuser = await tempUser.findOne({ email: req.body.email });
    if (tempuser)
      return res
        .status(400)
        .send("please check your mail for the verifacation email");
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("you have to register first");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).send("The password or the email is incorrect");
    const token = user.generateAuthToken();
    res.header("x-auth-token", token).send(_.pick(user, ["username", "email"]));
  })
);

function validate(user) {
  const schema = {
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).max(255),
  };
  return Joi.validate(user, schema);
}

module.exports = router;
