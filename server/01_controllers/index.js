// Requires (from node_modules):
const express = require("express"); 
const bodyParser = require("body-parser"); 
const path=require('path');


// Requires (to activate this file that opens the connection to the DB):
const index = require('./../00_models/index');

// Requires (from current folder - to add controllers to our express app):
const product=require('./product');
const user=require('./user');
const cities=require('./cities');
const category=require('./category');
const cart=require('./cart');
const cartItems=require('./cartitem');
const order=require('./order');


// Create express app:
const app = express();

/* CORS */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, xx-auth');
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.status(200).end();
    }
    else {
        next();
    }
});

// Use middlewares (app level):
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname+"/../02_views"))); 


app.get("/ShoppingOnline",(req,res)=>{   //angular routing
    res.sendFile(path.join(__dirname+"/../02_views/index.html"));
});

product.init(app);
user.init(app);
cities.init(app);
category.init(app);
cart.init(app);
cartItems.init(app);
order.init(app);


app.listen(process.env.PORT || 6200, ()=>{console.log("ok")})
module.exports={app};
