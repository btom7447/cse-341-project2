const { getDb } = require("../data/database");
const { body, validationResult } = require("express-validator");
const { ObjectId } = require("mongodb");

exports.validate = [
  body("movie").isString().notEmpty(),
  body("theater").isString().notEmpty(),
  body("showTime").isISO8601(),
  body("seat").isString().notEmpty(),
  body("price").isNumeric(),
  body("quantity").isInt({ min: 1 }),
];

exports.getAll = async (req, res) => {
  try {
    const db = getDb();
    const bookings = await db.collection("bookings").find().toArray();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const db = getDb();
    const { movie, theater, showTime, seat, price, quantity, category } = req.body;
    const result = await db.collection("bookings").insertOne({
      movie,
      theater,
      showTime,
      seat,
      price,
      quantity,
      category,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.update = async (req, res) => {
  try {
    const db = getDb();
    const { movie, theater, showTime, seat, price, quantity, category } = req.body;
    const result = await db.collection("bookings").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { movie, theater, showTime, seat, price, quantity, category, updatedAt: new Date() } }
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.delete = async (req, res) => {
  try {
    const db = getDb();
    const result = await db.collection("bookings").deleteOne({
      _id: new ObjectId(req.params.id),
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
