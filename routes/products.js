const express = require("express");
const router = express.Router();
const { Product, validate } = require("../models/product");
const { Category } = require("../models/category");
const exceptionHandler = require("../middleware/exceptionHandling");
const auth = require("../middleware/auth");
const shopOwner = require("../middleware/shopOwner");
const _ = require("lodash");
const { MongoClient } = require("mongodb");
const config = require("config");

router.get(
  "/:productId",
  exceptionHandler(async (req, res) => {
    const product = await Product.findById(req.params.productId);
    if (!product) res.status(400).send("invalid product id");
    res.send(product);
  })
);

router.get(
  "/",
  exceptionHandler(async (req, res) => {
    const products = await Product.find().sort({ discount: 1 }).limit(10);
    res.send(products);
  })
);

router.post(
  "/:shopId",
  [auth, shopOwner],
  exceptionHandler(async (req, res) => {
    const { error } = validate(req.body);
    if (error) res.status(400).send(error.details[0].message);
    const shop = req.shop;
    const oldProduct = await Product.findOne({
      "id.shopName": shop.shopName,
      "id.name": req.body.productName,
    });
    if (oldProduct)
      return res.status(400).send("this product is already in your shop");
    const category = await Category.findOne({
      categoryName: req.body.categoryName,
    });
    if (!category)
      return res
        .status(400)
        .send("the category you entered is not a valid category");

    const product = new Product({
      id: {
        name: req.body.productName,
        shopName: shop.shopName,
      },
      price: req.body.price,
      colors: req.body.colors,
      sizes: req.body.sizes,
      category: category.categoryName,
      image: req.body.image,
      amount: req.body.amount,
      details: req.body.details,
    });
    await product.save();
    res.send(product);
  })
);

router.put(
  "/:productId/:shopId",
  [auth, shopOwner],
  exceptionHandler(async (req, res) => {
    const { error } = validate(req.body);
    if (error) res.status(400).send(error.details[0].message);

    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(400).send("invalid product id");
    const category = await Category.findOne({
      categoryName: req.body.categoryName,
    });
    if (!category) return res.status(400).send("invlalid category");

    product.id.name = req.body.productName;
    product.price = req.body.price;
    product.colors = req.body.colors;
    product.sizes = req.body.sizes;
    product.category = category.categoryName;
    product.image = req.body.image;
    product.amount = req.body.amount;
    product.details = req.body.details;

    await product.save();
    res.send(product);
  })
);

router.delete(
  "/:productId/:shopId",
  [auth, shopOwner],
  exceptionHandler(async (req, res) => {
    const client = new MongoClient(`${config.get("dbString")}`);
    await client.connect();
    const session = client.startSession();
    // new Fawn.Task()
    //     .remove('Product',{_id:req.params.productId})
    //     //.remove('Rate',{product:{id:req.params.productId}})
    //     .run();
    const transactionOptions = {
      readPreference: "primary",
      readConcern: { level: "local" },
      writeConcern: { w: "majority" },
    };
    await session.withTransaction(async () => {
      const coll1 = client.db("market").collection("Product");
      // const coll2 = client.db('market').collection('Rate');

      // Important:: You must pass the session to the operations

      await coll1.deleteOne({ _id: req.params.productId }, { session });
      //await coll2.deleteMany({product:{id:req.params.productId}}, { session });
    }, transactionOptions);
    await session.endSession();
    return true;
  })
);

module.exports = router;
