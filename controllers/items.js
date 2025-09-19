const { getDb } = require("../data/database");
const { body, validationResult } = require("express-validator");

exports.validate = [
  body("name").isString().notEmpty(),
  body("price").isNumeric(),
];

exports.getAll = async (req, res) => {
  try {
    const db = getDb();
    const items = await db.collection("items").find().toArray();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const db = getDb();
    const { name, price } = req.body;
    const result = await db.collection("items").insertOne({ name, price });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.update = async (req, res) => {
  try {
    const db = getDb();
    const { name, price } = req.body;
    const result = await db.collection("items").updateOne(
      { _id: new require("mongodb").ObjectId(req.params.id) },
      { $set: { name, price } }
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.delete = async (req, res) => {
  try {
    const db = getDb();
    const result = await db.collection("items").deleteOne({
      _id: new require("mongodb").ObjectId(req.params.id),
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
