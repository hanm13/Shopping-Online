const mongoose = require("mongoose");



// Connect to MongoDB: 
//if we run it in production mode - connect to `Atlas DB` 
// else - connect to local mongo DB
let uri = (process.env.PORT) ?
    "change-this-to-heroku-mongodb-connection-string" :
    "mongodb://localhost:27017/shoppingOnline";


    mongoose.connect(uri, {useNewUrlParser: true})
    .then(() => {
        console.log("We're connected to MongoDB.");
    })
    .catch((e) => {
        console.log("We're not connected to MongoDB.", e);
    });




module.exports = {
    mongoose
}
