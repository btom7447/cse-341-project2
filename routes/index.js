const router = require("express").Router();

// Hello world test route
router.get("/", (req, res) => { 
    //#swagger.tags=['Hello World']
    res.send("Hello World");
});

// User routes
router.use("/users", require("./users"));

// Booking routes (was '/items', now '/bookings')
router.use("/bookings", require("./bookings"));

module.exports = router;
