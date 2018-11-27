const mongoose = require("mongoose");

let cartSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        default: Date.now
    },
    active: {
        type: Boolean,
        default: true,
    }
});

let CartModel = mongoose.model("Cart", cartSchema);

module.exports = {
    CartModel
}