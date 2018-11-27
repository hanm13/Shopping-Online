const cart = require('./../00_models/cart');
const cartItem = require('./../00_models/cartitem');
const order = require('./../00_models/order');
const userMiddleware = require("./middlewares/user")
const product = require('../00_models/product');

let init = (app) => {

    // Get all user orders by user ID.

    app.get("/api/orders/:q", userMiddleware.middleware, (req, res) => {

        order.OrderModel.find({"userID":req.params.q})
        .then(orders => {
 
            res.status(200).send(JSON.stringify({"orders":orders}));


        })
        .catch((e) => { res.status(400).send(e) });
       
    });

    // Get counter of orders with the given date;

    app.get("/api/count/ordersdate/:q", userMiddleware.middleware, (req, res) => {

        order.OrderModel.count({"shippingDate":req.params.q})
        .then(count => {

            res.status(200).send(JSON.stringify({"ordersAmount":count}));
    
            


        })
        .catch((e) => { res.status(400).send(e) });
        
    });

    // Create new order by userID
    app.post("/api/orders/:q", userMiddleware.middleware, (req, res) => {

        cart.CartModel.findOne({"userID":req.params.q, "active":true})
        .then(userCart => {

            return userCart;

        }).then((userCart)=>{

            cartItem.CartItemModel.find({"cartID": userCart._id}) // we need the cart items so we can calculate the total price
            .then(products => {


                let totalProductsPrice = 0;

                for (let index = 0; index < products.length; index++) {
                    const element = products[index];

                    totalProductsPrice += element.totalPrice;
                    
                }

                let newOrder = new order.OrderModel({...req.body, userID:req.params.q , cartID:userCart._id, "totalPrice": totalProductsPrice}); // item info
    
                newOrder.save()
                    .then(() => {
                        
                        console.log("saved");

                        userCart.active = false;
                        userCart.save().then(()=>{

                            order.OrderModel.find({"userID": req.params.q}).then((orders)=>{

                                res.status(200).send({"orders": orders});

                            })

                            

                        });

                        
                    })
                    .catch((e) => {
                        
                        res.status(400).send(e)
                    });
            
                
            })

        })
        .catch((e) => { res.status(400).send(e) });


       
    })

    // Delete order by order ID

    app.delete("/api/orders/:q", userMiddleware.middleware, (req, res) =>{

        order.OrderModel.deleteOne({_id: req.params.q})
        .then(() => {

            res.status(200).send("Deleted!");
        })
        .catch(err => res.status(400).send(err));
    
    });

    // Get products count
    app.get("/api/count/orders", (req, res) => {
    
        order.OrderModel.count({})
        .then(counter=>{

            res.status(200).send(JSON.stringify({counter:counter}));
            
            
        })
        .catch((e) => { res.status(400).send(e) });
        
    });

}

module.exports = { init }

/*

Create new order by by userID - POST request


curl -v -X POST -H "Content-type: application/json" -H "xx-auth: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbklkIjoiNWJmMWFmOWQ4MDUyZTc2NzZjYzIzYjNlIiwiaWF0IjoxNTQyNTY1ODQyfQ.ku55pJMYwwuugNMwUr-PAS14KV4bQJcNoiWHPQdlTi8" -d  "{\"city\":\"batYam\",\"street\":\"Balfur\",\"shippingDate\":\"21/11/2018\",\"visaDigits\":\"4567\"}" localhost:6200/api/orders/5bf15b5a7668b92468f010d1

response :

* upload completely sent off: 120 out of 120 bytes
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< Access-Control-Allow-Methods: GET,PUT,POST,DELETE
< Access-Control-Allow-Headers: Content-Type, xx-auth
< Content-Type: application/json; charset=utf-8
< Content-Length: 244
< ETag: W/"f4-VBdKxwuoPZsc9A4V/sNe6JHpdmg"
< Date: Wed, 21 Nov 2018 09:13:35 GMT
< Connection: keep-alive
<
{"totalPrice":125,"_id":"5bf521bfc540cf0480742d65","city":"batYam","street":"Balfur","shippingDate":"21/11/2018","visaDigits":"4567","cartID":"5bf3ec1b7278ab0a7ca8f0a3","userID":"5bf15b5a7668b92468f010d1","creationDate":"1542791615150","__v":0}* Connection #0 to host localhost left intact

_____

Get count of orders - GET request

curl -v -X GET localhost:6200/api/count/orders

reponse:

< HTTP/1.1 200 OK
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< Access-Control-Allow-Methods: GET,PUT,POST,DELETE
< Access-Control-Allow-Headers: Content-Type, xx-auth
< Content-Type: text/html; charset=utf-8
< Content-Length: 13
< ETag: W/"d-rZUXrye32QAdr5FtUENPEkpYlhQ"
< Date: Fri, 23 Nov 2018 10:34:03 GMT
< Connection: keep-alive
<
{"counter":1}* Connection #0 to host localhost left intact

_____


get all user orders by userID

5bf15b5a7668b92468f010d1 - BobB user ID

curl -v -X GET -H "xx-auth: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbklkIjoiNWJmMWFmOWQ4MDUyZTc2NzZjYzIzYjNlIiwiaWF0IjoxNTQyNTY1ODQyfQ.ku55pJMYwwuugNMwUr-PAS14KV4bQJcNoiWHPQdlTi8" localhost:6200/api/orders/5bf15b5a7668b92468f010d1

Response:


< HTTP/1.1 200 OK
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< Access-Control-Allow-Methods: GET,PUT,POST,DELETE
< Access-Control-Allow-Headers: Content-Type, xx-auth
< Content-Type: text/html; charset=utf-8
< Content-Length: 500
< ETag: W/"1f4-wjqSRSLIElj3z3ERtWJq1kfZ72g"
< Date: Wed, 21 Nov 2018 09:13:51 GMT
< Connection: keep-alive
<
{"orders":[{"totalPrice":0,"_id":"5bf51fc90b901d2f7cec6384","city":"batYam","street":"Balfur","shippingDate":"21/11/2018","visaDigits":"4567","cartID":"5bf3ec1b7278ab0a7ca8f0a3","userID":"5bf15b5a7668b92468f010d1","creationDate":"1542791113538","__v":0},{"totalPrice":125,"_id":"5bf521bfc540cf0480742d65","city":"batYam","street":"Balfur","shippingDate":"21/11/2018","visaDigits":"4567","cartID":"5bf3ec1b7278ab0a7ca8f0a3","userID":"5bf15b5a7668b92468f010d1","creationDate":"1542791615150","__v":0}]}* Connection #0 to host localhost left intact

*/



/*

Delete order by orderID

curl -v -X DELETE -H "xx-auth: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbklkIjoiNWJmMWFmOWQ4MDUyZTc2NzZjYzIzYjNlIiwiaWF0IjoxNTQyNTY1ODQyfQ.ku55pJMYwwuugNMwUr-PAS14KV4bQJcNoiWHPQdlTi8" localhost:6200/api/orders/5bf51fc90b901d2f7cec6384

Reponse:

< HTTP/1.1 200 OK
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< Access-Control-Allow-Methods: GET,PUT,POST,DELETE
< Access-Control-Allow-Headers: Content-Type, xx-auth
< Content-Type: text/html; charset=utf-8
< Content-Length: 8
< ETag: W/"8-1z6ssizdlKMf7K4C7nfIUlQscuk"
< Date: Wed, 21 Nov 2018 09:14:18 GMT
< Connection: keep-alive
<
Deleted!* Connection #0 to host localhost left intact

*/

/*

Get count of orders by shipping date


curl -v -X GET -H "xx-auth: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbklkIjoiNWJmMWFmOWQ4MDUyZTc2NzZjYzIzYjNlIiwiaWF0IjoxNTQyNTY1ODQyfQ.ku55pJMYwwuugNMwUr-PAS14KV4bQJcNoiWHPQdlTi8" localhost:6200/api/count/ordersdate/2018-11-23

Response:

< HTTP/1.1 200 OK
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< Access-Control-Allow-Methods: GET,PUT,POST,DELETE
< Access-Control-Allow-Headers: Content-Type, xx-auth
< Content-Type: text/html; charset=utf-8
< Content-Length: 18
< ETag: W/"12-tJLflc1xiZji6k9TUOmLiDUYUz4"
< Date: Sat, 24 Nov 2018 12:33:22 GMT
< Connection: keep-alive
<
{"ordersAmount":1}* Connection #0 to host localhost left intact

*/
