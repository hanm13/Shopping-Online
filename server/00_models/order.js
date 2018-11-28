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
        required: true
    },
    city: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 25
    },
    street: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 25
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
        minlength: 4,
        maxlength: 4
    },
});

let OrderModel = mongoose.model("Order", orderSchema);

module.exports = {
    OrderModel
}