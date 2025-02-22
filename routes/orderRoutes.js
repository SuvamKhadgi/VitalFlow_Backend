const express = require("express");
const router = express.Router();
const { saveOrder, findAll, deleteById } = require("../controller/orderController");

router.post("/", saveOrder);
router.get("/", findAll);
router.delete("/:id", deleteById);



module.exports = router;