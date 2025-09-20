const { getDb } = require("../data/database");
const { body, validationResult } = require("express-validator");
const { ObjectId } = require("mongodb");

// Validation middleware
exports.validate = [
  body("movie").isString().notEmpty(),
  body("theater").isString().notEmpty(),
  body("showTime").isISO8601(),
  body("seat").isString().notEmpty(),
  body("price").isNumeric(),
  body("quantity").isInt({ min: 1 }),
];

// GET all bookings
exports.getAll = async (req, res) => {
  //#swagger.tags=['Bookings']
  try {
    const db = getDb();
    const bookings = await db.collection("bookings").find().toArray();
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// CREATE booking
exports.create = async (req, res) => {
  //#swagger.tags=['Bookings']
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

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

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: { id: result.insertedId },
    });
  } catch (err) {
    console.error("Bookings error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// UPDATE booking
exports.update = async (req, res) => {
  //#swagger.tags=['Bookings']
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, error: "Invalid booking ID" });
  }

  try {
    const db = getDb();
    const { movie, theater, showTime, seat, price, quantity, category } = req.body;

    const result = await db.collection("bookings").updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          movie,
          theater,
          showTime,
          seat,
          price,
          quantity,
          category,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, error: "Booking not found" });
    }

    res.json({ success: true, message: "Booking updated successfully" });
  } catch (err) {
    console.error("Bookings error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// DELETE booking
exports.delete = async (req, res) => {
  //#swagger.tags=['Bookings']
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, error: "Invalid booking ID" });
  }

  try {
    const db = getDb();
    const result = await db.collection("bookings").deleteOne({
      _id: new ObjectId(req.params.id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: "Booking not found" });
    }

    res.json({ success: true, message: "Booking deleted successfully" });
  } catch (err) {
    console.error("Bookings error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
