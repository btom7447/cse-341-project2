const express = require("express");
const router = express.Router();
const bookingsController = require("../controllers/bookings"); // renamed
const auth = require("../middleware/auth");

router.get("/", bookingsController.getAll);
router.post("/", auth, bookingsController.validate, bookingsController.create);
router.put("/:id", auth, bookingsController.update);
router.delete("/:id", auth, bookingsController.delete);

module.exports = router;
