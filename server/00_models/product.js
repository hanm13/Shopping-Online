const mongoose = require("mongoose");

let productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 1
    },
    categoryId: { // Mongo _id !
        type: String,
        required: true,
    },
    price: {
        type: Number
    },
    imageAddress: {
        type: String
    },

});

let ProductModel = mongoose.model("Product", productSchema);

module.exports = {
    ProductModel
}