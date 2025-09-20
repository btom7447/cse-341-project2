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
  //#swagger.tags=['Bookings]
  try {
    const db = getDb();
    const bookings = await db.collection("bookings").find().toArray();
    res.status(200).json({ bookings });
  } catch (err) {
    console.error("Get all bookings error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.create = async (req, res) => {
  //#swagger.tags=['Bookings]
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
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
      message: "Booking created successfully",
      bookingId: result.insertedId,
    });
  } catch (err) {
    console.error("Create booking error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.update = async (req, res) => {
  //#swagger.tags=['Bookings]
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid booking ID format" });
    }

    const db = getDb();
    const { movie, theater, showTime, seat, price, quantity, category } = req.body;

    const result = await db.collection("bookings").updateOne(
      { _id: new ObjectId(id) },
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
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json({ message: "Booking updated successfully" });
  } catch (err) {
    console.error("Update booking error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.delete = async (req, res) => {
  //#swagger.tags=['Bookings]
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid booking ID format" });
    }

    const db = getDb();
    const result = await db.collection("bookings").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (err) {
    console.error("Delete booking error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
