const mongoose = require("mongoose");

let cartItemSchema = new mongoose.Schema({
    productID: {
        type: String,
    },
    amount: {
        type: Number,
        required: [true,'amount required']
    },
    totalPrice: {
        type: Number,
    },
   cartID: {
        type: String,
    } // active cart of the user
});

let CartItemModel = mongoose.model("CartItem", cartItemSchema);

module.exports = {
    CartItemModel
}