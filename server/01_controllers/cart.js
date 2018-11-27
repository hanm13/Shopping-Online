const jwt = require('jsonwebtoken');
const cart = require('./../00_models/cart');
const user = require('./../00_models/user');
const userMiddleware = require("./middlewares/user")

let init = (app) => {

    // Get all carts by user ID
    app.get("/api/carts/:q", userMiddleware.middleware, (req, res) => {

        cart.CartModel.find({"userID":req.params.q})
        .then(carts => {
            res.status(200).send(JSON.stringify({"carts":carts}));
        })
        .catch((e) => { res.status(400).send(e) });
       
    });

    // Get user active carts by user ID
    app.get("/api/activecarts/:q", userMiddleware.middleware, (req, res) => {

        cart.CartModel.find({"userID":req.params.q, "active":true})
        .then(carts => {
            res.status(200).send(JSON.stringify({"carts":carts}));
        })
        .catch((e) => { res.status(400).send(e) });
        
    });

    // Create new cart
    app.post("/api/carts", userMiddleware.middleware, (req, res) => {

            cart.CartModel.count({userID: req.body.userID, active:true})
                .then(count => {

                    if(count > 0 ){

                        res.status(400).send("Failed to create new cart, user already have active cart!");

                    }else{

                        let newCart = new cart.CartModel(req.body);
                        newCart.save()
                            .then(() => {
                                
                                res.status(200).send(newCart)
                            })
                            .catch((e) => {
                                
                                res.status(400).send(e)
                            });

                    }

                })
                .catch(err => {
                    
                    res.status(400).send(err)
                });
       

       
    })

    // Update cart by ID

    app.put("/api/carts/:q", userMiddleware.middleware, (req, res) =>{

        cart.CartModel.findOne({_id: req.params.q})
        .then(cart => {

            cart.userID = req.body.userID;
            cart.date = req.body.price;
            cart.active = req.body.active;
            cart.save();
            res.status(200).send(cart);
        })
        .catch(err => res.status(400).send(err));
    
    });

    // Delete cart by ID

    app.delete("/api/carts/:q", userMiddleware.middleware, (req, res) =>{

        cart.CartModel.deleteOne({_id: req.params.q})
        .then(() => {

            res.status(200).send("Deleted!");
        })
        .catch(err => res.status(400).send(err));
    
    });

}

module.exports = { init }

/*

Create new cart - POST request


curl -v -X POST -H "Content-type: application/json" -H "xx-auth: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbklkIjoiNWJmMWFmOWQ4MDUyZTc2NzZjYzIzYjNlIiwiaWF0IjoxNTQyNTY1ODQyfQ.ku55pJMYwwuugNMwUr-PAS14KV4bQJcNoiWHPQdlTi8" -d  "{\"userID\":\"5bf15b5a7668b92468f010d1\",\"date\":\"20.11.2018\"}" localhost:6200/api/carts

response :

* upload completely sent off: 57 out of 57 bytes
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< Access-Control-Allow-Methods: GET,PUT,POST,DELETE
< Access-Control-Allow-Headers: Content-Type, xx-auth
< Content-Type: application/json; charset=utf-8
< Content-Length: 112
< ETag: W/"70-ghBEUFTyN8+28CTVIxQuDWaJW64"
< Date: Tue, 20 Nov 2018 08:17:15 GMT
< Connection: keep-alive
<
{"active":true,"_id":"5bf3c30bad2f7f58e447fa85","userID":"5bf15b5a7668b92468f010d1","date":"20.11.2018","__v":0}* Connection #0 to host localhost left intact

_____


Get all carts by userID - GET request

5bf15b5a7668b92468f010d1 - BobB user ID

curl -v -X GET -H "xx-auth: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbklkIjoiNWJmMWFmOWQ4MDUyZTc2NzZjYzIzYjNlIiwiaWF0IjoxNTQyNTY1ODQyfQ.ku55pJMYwwuugNMwUr-PAS14KV4bQJcNoiWHPQdlTi8" localhost:6200/api/carts/5bf15b5a7668b92468f010d1

Response:

< HTTP/1.1 200 OK
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< Access-Control-Allow-Methods: GET,PUT,POST,DELETE
< Access-Control-Allow-Headers: Content-Type, xx-auth
< Content-Type: text/html; charset=utf-8
< Content-Length: 692
< ETag: W/"2b4-kAATeA/SPgrd0yx2rgavas8WaRA"
< Date: Tue, 20 Nov 2018 08:27:56 GMT
< Connection: keep-alive
<
{"carts":[{"active":true,"_id":"5bf3cc8fddf52360a8185e75","userID":"5bf15b5a7668b92468f010d1","date":"20.11.2018","__v":0},{"active":true,"_id":"5bf3c516ca1d29164042558c","userID":"5bf15b5a7668b92468f010d1","date":"20.11.2018","__v":0},{"active":true,"_id":"5bf3c55207a0440690537884","userID":"5bf15b5a7668b92468f010d1","date":"20.11.2018","__v":0},{"active":false,"_id":"5bf3c56f95c1675ca4fa6e87","userID":"5bf15b5a7668b92468f010d1","date":"20.11.2018","__v":0},{"active":false,"_id":"5bf3c578f0a82845acba34c6","userID":"5bf15b5a7668b92468f010d1","date":"20.11.2018","__v":0},{"active":false,"_id":"5bf3c586b7239d58908f1e26","userID":"5bf15b5a7668b92468f010d1","date":"20.11.2018","__v":0}]}* Connection #0 to host localhost left intact

*/

/*

Get all active carts by userID - GET request

5bf15b5a7668b92468f010d1 - BobB user ID

curl -v -X GET -H "xx-auth: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbklkIjoiNWJmMWFmOWQ4MDUyZTc2NzZjYzIzYjNlIiwiaWF0IjoxNTQyNTY1ODQyfQ.ku55pJMYwwuugNMwUr-PAS14KV4bQJcNoiWHPQdlTi8" localhost:6200/api/activecarts/5bf15b5a7668b92468f010d1

Reponse:

< HTTP/1.1 200 OK
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< Access-Control-Allow-Methods: GET,PUT,POST,DELETE
< Access-Control-Allow-Headers: Content-Type, xx-auth
< Content-Type: text/html; charset=utf-8
< Content-Length: 127
< ETag: W/"7f-OxUALtzFkPqCMaIsWkkDKdnxuRM"
< Date: Thu, 22 Nov 2018 14:33:46 GMT
< Connection: keep-alive
<
{"carts":[{"active":true,"_id":"5bf3ec1b7278ab0a7ca8f0a3","userID":"5bf15b5a7668b92468f010d1","date":"1542712347182","__v":0}]}* Connection #0 to host localhost left intact
*/

/*

_____


Delete cart by cart ID - DELETE request

5bf3c55207a0440690537884

curl -v -X DELETE -H "xx-auth: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbklkIjoiNWJmMWFmOWQ4MDUyZTc2NzZjYzIzYjNlIiwiaWF0IjoxNTQyNTY1ODQyfQ.ku55pJMYwwuugNMwUr-PAS14KV4bQJcNoiWHPQdlTi8" localhost:6200/api/carts/5bf3f7ac5348e75f44bd979a

reponse:

< HTTP/1.1 200 OK
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< Access-Control-Allow-Methods: GET,PUT,POST,DELETE
< Access-Control-Allow-Headers: Content-Type, xx-auth
< Content-Type: text/html; charset=utf-8
< Content-Length: 8
< ETag: W/"8-1z6ssizdlKMf7K4C7nfIUlQscuk"
< Date: Tue, 20 Nov 2018 08:46:10 GMT
< Connection: keep-alive
<
Deleted!* Connection #0 to host localhost left intact

*/