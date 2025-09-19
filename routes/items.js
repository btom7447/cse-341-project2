const express = require("express");
const router = express.Router();
const itemsController = require("../controllers/itemsController");
const auth = require("../middleware/auth");

router.get("/", itemsController.getAll);
router.post("/", auth, itemsController.validate, itemsController.create);
router.put("/:id", auth, itemsController.update);
router.delete("/:id", auth, itemsController.delete);

module.exports = router;
