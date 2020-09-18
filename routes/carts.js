const express = require("express");
const router = express.Router();
const { Product } = require("../models/product");
const { Cart } = require("../models/cart");
const exceptionHandling = require("../middleware/exceptionHandling");
const auth = require("../middleware/auth");
const _ = require("lodash");
const Fawn = require("fawn");

router.get(
  "/",
  auth,
  exceptionHandling(async (req, res) => {
    const cart = await Cart.findOne({ userId: req.userToken._id });
    res.send(cart);
  })
);

router.put(
  "/:productId",
  auth,
  exceptionHandling(async (req, res) => {
    let product = await Product.findById(req.params.productId);
    if (!product) return res.status(400).send("invalid product id");
    const cart = await Cart.findOne({ userId: req.userToken._id });
    if (
      _.find(cart.products, function (prod) {
        return prod.id == req.params.productId;
      }) != undefined
    )
      return res.status(400).send("this product is already in your cart");
    cart.products.push({ id: req.params.productId });
    await cart.save();
    res.send(cart);
  })
);

router.delete(
  "/:productId",
  auth,
  exceptionHandling(async (req, res) => {
    let product = await Product.findById(req.params.productId);
    if (!product) return res.status(400).send("invalid product id");
    const cart = await Cart.findOne({ userId: req.userToken._id });
    cart.products = _.filter(cart.products, { id: req.params.productId });
    await cart.save();
    res.send(cart);
  })
);

module.exports = router;
