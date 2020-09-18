const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const { tempUser } = require("../models/tempUser");
const { Cart } = require("../models/cart");
const { Favourite } = require("../models/favourite");
const _ = require("lodash");
const bcrybt = require("bcrypt");
const config = require("config");
const exceptionHandling = require("../middleware/exceptionHandling");
const randomString = require("randomstring");
const nodemailer = require("nodemailer");

router.post(
  "/",
  exceptionHandling(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const tempuser = await tempUser.findOne({ email: req.body.email });
    if (tempuser)
      return res
        .status(400)
        .send(
          "this email is already registered please check your email for verifacation "
        );
    const oldUser = await User.findOne({ email: req.body.email });
    if (oldUser)
      return res.status(400).send("this email is already registered");
    const user = new tempUser(
      _.pick(req.body, ["username", "email", "phone", "address"])
    );
    const salt = await bcrybt.genSalt(_.toInteger(config.get("saltLength")));
    user.password = await bcrybt.hash(req.body.password, salt);
    const randomGeneratedString = randomString.generate(
      _.toInteger(config.get("verificationUrlLength"))
    );
    user.urlString = randomGeneratedString;
    console.log(randomGeneratedString);
    // send the email through my email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: "workteam1999@gmail.com",
        pass: "sdqxaatqpmpzdfsy",
      },
    });
    const mailOptions = {
      from: "workteam1999@gmail.com",
      to: user.email,
      subject: "verification email",
      text: `please click on this link to verify your email on Market website ${config.get(
        "host"
      )}register/emailverification/${randomGeneratedString}`,
    };
    const t = await transporter.sendMail(mailOptions);
    await user.save();
    res.send(t);
  })
);

router.get(
  "/emailVerification/:id",
  exceptionHandling(async (req, res) => {
    const tempuser = await tempUser.findOne({ urlString: req.params.id });
    if (!tempuser)
      return res.status(400).send("invaild url please check your email");
    const user = new User(
      _.pick(tempuser, ["username", "email", "phone", "address", "password"])
    );
    const cart = new Cart({
      userId: user.id,
    });
    const favourite = new Favourite({
      userId: user.id,
    });
    await user.save();
    await tempuser.deleteOne();
    await favourite.save();
    await cart.save();
    const token = user.generateAuthToken();
    res.header("x-auth-token", token).send(_.pick(user, ["username", "email"]));
  })
);

module.exports = router;
