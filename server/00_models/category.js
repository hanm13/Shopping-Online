const mongoose = require("mongoose");

let categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        unique: true,
    },

});

let CategoryModel = mongoose.model("Category", categorySchema);

module.exports = {
    CategoryModel
}