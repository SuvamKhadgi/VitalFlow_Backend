const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "credential",
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone_no: {
        type: String,
        required: true
    },
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "cart",
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model("order", orderSchema);

module.exports = Order;