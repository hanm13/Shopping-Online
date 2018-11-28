const mongoose = require("mongoose");


let userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 15
        },
        lastName: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 15
        },
        userName: {
            type: String,
            required: true,
            unique: true,
            minlength: 2,
            maxlength: 30
        },
        password: {
            type: String,
            required: true,
            minlength: 64,
            maxlength: 64
        },
        personID: {
            type: String,
            required: true,
            unique: true,
            minlength: 9,
            maxlength: 9
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
        role: {
            type: Number,
            required: true,
            default: 0,
        },
        /*cart: {
            type: []
        }*/
    }
);

let UserModel = mongoose.model("User", userSchema);

module.exports = {
    UserModel
}


