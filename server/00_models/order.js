const mongoose = require("mongoose");

let orderSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
    },
    cartID: {
        type: String,
        required: true,
    },
    totalPrice: {
        type: Number,
        default: true,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    street: {
        type: String,
        required: true,
    },
    shippingDate: {
        type: String,
        required: true,
    },
    creationDate: {
        type: String,
        default: Date.now

    },
    visaDigits: {
        type: String,
        required: true,
    },
});

let OrderModel = mongoose.model("Order", orderSchema);

module.exports = {
    OrderModel
}