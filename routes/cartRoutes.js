const express = require("express");
const router = express.Router();
const { findAll, save, findById, deleteById, updateById, findByUserId, getCartById, deleteItemFromCart } = require("../controller/cartController");
const { authorization } = require("../security/auth");

// const multer = require('multer');
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads')
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname)
//     }
// });
// const upload = multer({ storage });

router.get("/", findAll);
router.post("/", save);
router.get("/:id", findById);
router.get("/user/:id", findByUserId);
router.delete("/:id", deleteById);
router.put("/:id", updateById);
router.get("/item/:cartId", getCartById);
router.delete("/:cartId/item/:itemId", deleteItemFromCart);
module.exports = router;