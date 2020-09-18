const express = require("express");
const users = require("../routes/users");
const home = require("../routes/home");
const login = require("../routes/login");
const register = require("../routes/register");
const category = require("../routes/categories");
const shop = require("../routes/shops");
const rate = require("../routes/rates");
const product = require("../routes/products");
const favourite = require("../routes/favourites");
const carts = require("../routes/carts");
const orders = require("../routes/orders");

module.exports = (app) => {
  app.use(express.json());
  app.use("/users", users);
  app.use("/", home);
  app.use("/login", login);
  app.use("/register", register);
  app.use("/category", category);
  app.use("/shop", shop);
  app.use("/rate", rate);
  app.use("/product", product);
  app.use("/cart", carts);
  app.use("/favourite", favourite);
  app.use("/order", orders);
};
