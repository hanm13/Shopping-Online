const cart = require('./../00_models/cart');
const cartItem = require('./../00_models/cartitem');
const userMiddleware = require("./middlewares/user")
const product = require('../00_models/product');

let init = (app) => {

    // Get all cart items from the active cart of the user by user ID.

    app.get("/api/cartitems/:q", userMiddleware.middleware, (req, res) => {

        cart.CartModel.findOne({"userID":req.params.q, "active":true})
        .then(cart => {
 
            if(cart){
                getFileteredCartItems(cart).then((cartItems)=>{

                    res.status(200).send(cartItems);

                })

            }else{
                res.status(200).send({"cartitems":[]});
            }



        })
        .catch((e) => { res.status(400).send(e) });
       
    });

    let getFileteredCartItems = (cart) => {

        return new Promise((resolve,reject)=>{

        cartItem.CartItemModel.find({"cartID":cart._id})
                .then(items => {

                        let productIds = [];

                        items.forEach(element => {

                            productIds.push(element.productID);
                            
                        });


                        // We use array of ids to find all products with the same id,
                        // then we use the returned array of products for set imageAddress and name of product for cart item.
                        product.ProductModel.find({ 
                            '_id': { $in: productIds} // Find products that have the ids inside the productIds array.
                        }, function(err, docs){
                             console.log(docs);
                        }).then((products)=>{

                            let filteredItemsArr = [];

                            products.forEach(product => {

                                for (let index = 0; index < items.length; index++) {

                                    if( product._id == items[index].productID){ // check if cart item has the same productID.

                                        // we creating temp object for getting the properties and also setting new ones as the imageAddress and name.
                                        let tempObj = {
                                            _id: items[index]._id,
                                            productID: items[index].productID,
                                            amount: items[index].amount,
                                            cartID: items[index].cartID,
                                            totalPrice: items[index].totalPrice,
                                            __v: items[index].__v,
                                            imageAddress: product.imageAddress,
                                            name: product.name,
                                            priceSingle: product.price,
                                        };

                                        filteredItemsArr.push(tempObj);

                                    }
                                    
                                }
                                
                            });

                            resolve({"cartitems":filteredItemsArr});

                        })
                    
                })
                .catch((e) => { res.status(400).send(e) });

        })

    }

    let getProductTotalPriceByID = (productID,amount) => {

        return new Promise((resolve,reject)=>{

            product.ProductModel.findOne({"_id":productID})
            .then(product => {

                resolve(product.price * amount);

            })
            .catch((e) => {

                reject(e);

            });

        })

    }

    let createNewUserCart = (userID) => {

        return new Promise((resolve,reject)=>{

            // Createing new user cart!
            let newUserCart = new cart.CartModel({"userID":userID});
            console.log("Creating new user cart because we added items without any cart, new cart ID:", newUserCart._id);

            newUserCart.save().then(()=>{

                resolve(newUserCart);

            })

        })

    }

    // Create new cart item for user by ID
    app.post("/api/cartitems/:q", userMiddleware.middleware, (req, res) => {

        cart.CartModel.findOne({"userID":req.params.q, "active":true})
        .then(async userCart => {

            if(!userCart){

                userCart = await createNewUserCart(req.params.q);

            }

            return userCart;

        }).then((userCart)=>{

            console.log("User cart ID:", userCart._id);

            cartItem.CartItemModel.findOne({"cartID": userCart._id, "productID":req.body.productID})
            .then(product => {

                if(product){

                    res.status(400).send(`Item already in the cart, you should send PUT request to update the item in the cart, you can sent the PUT request to update item cart ID: ${product._id}`)
                    return;

                }

                getProductTotalPriceByID(req.body.productID, req.body.amount)
                .then((totalItemPrice)=>{

                    let newCartItem = new cartItem.CartItemModel({...req.body, cartID:userCart._id, "totalPrice": totalItemPrice}); // item info
    
                    newCartItem.save()
                        .then(() => {
                            
                            getFileteredCartItems(userCart).then((cartItems)=>{

                                res.status(201).send({...cartItems, userCart:userCart});
            
                            })

                        })
                        .catch((e) => {
                            
                            res.status(400).send(e)
                        });
                
    

                })
                
            })

        })
        .catch((e) => { res.status(400).send(e) });


       
    })

    // Update cart item by item cart ID

    app.put("/api/cartitems/:q", userMiddleware.middleware, (req, res) =>{

        cartItem.CartItemModel.findOne({_id: req.params.q})
        .then(cartItem => {

            getProductTotalPriceByID(cartItem.productID, req.body.amount).then((totalPrice)=> {
                
                cartItem.amount = req.body.amount;
                cartItem.totalPrice = totalPrice;
                cartItem.save().then(()=>{

                    cart.CartModel.findOne({"userID":req.body.userID, "active":true})
                        .then(userCart => {
                            getFileteredCartItems(userCart).then((cartItems)=>{

                                res.status(200).send(cartItems);
            
                            })
                        })

                })


            })


        })
        .catch(err => res.status(400).send(err));
    
    });

    // Delete cart item by cartID

    app.delete("/api/cartitems/:q", userMiddleware.middleware, (req, res) =>{

        cartItem.CartItemModel.findOne({"_id":req.params.q})
        .then(item => {
            return item;
        })
        .then((item)=>{

            cartItem.CartItemModel.deleteOne({_id: req.params.q})
            .then(() => {
    
                cart.CartModel.findOne({"_id":item.cartID, "active":true})
                .then(userCart => {

                    return userCart;

                })
                .then((userCart)=>{

                    getFileteredCartItems(userCart)
                        .then((cartItems)=>{
    
                            res.status(200).send(cartItems);
        
                        })
    

                })
                
            })
            .catch(err => res.status(400).send(err));

            //

        })

   
    
    });

    // Delete cart items by cart ID

    app.delete("/api/cartitems/empty/:q", userMiddleware.middleware, (req, res) =>{

        cartItem.CartItemModel.deleteMany({cartID: req.params.q})
        .then(() => {

            res.status(200).send();

        })
        .catch(err => res.status(400).send(err));
    
    });

}

module.exports = { init }

/*

Create new cart item - POST request


curl -v -X POST -H "Content-type: application/json" -H "xx-auth: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbklkIjoiNWJmMWFmOWQ4MDUyZTc2NzZjYzIzYjNlIiwiaWF0IjoxNTQyNTY1ODQyfQ.ku55pJMYwwuugNMwUr-PAS14KV4bQJcNoiWHPQdlTi8" -d  "{\"productID\":\"5bf1c28f2ef529256429f377\",\"amount\":5, \"cartID\":\"5bf3cc8fddf52360a8185e75\"}" localhost:6200/api/cartitems/5bf15b5a7668b92468f010d1

response :

* upload completely sent off: 88 out of 88 bytes
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< Access-Control-Allow-Methods: GET,PUT,POST,DELETE
< Access-Control-Allow-Headers: Content-Type, xx-auth
< Content-Type: application/json; charset=utf-8
< Content-Length: 108
< ETag: W/"6c-Rztid6/OgryTc5dbyVU3m9Mn2/s"
< Date: Tue, 20 Nov 2018 10:57:32 GMT
< Connection: keep-alive
<
{"cartitems":[{"_id":"5bf6c845d60a5731bc127aa9","productID":"5bf1bed299f5d908e812354e","amount":5,"cartID":"5bf6c845d60a5731bc127aa8","totalPrice":40,"__v":0,"imageAddress":"test","name":"Tnuva Milk","priceSingle":8},{"_id":"5bf6c8f0d60a5731bc127aaa","productID":"5bf6a253d10a8c365ce8374c","amount":5,"cartID":"5bf6c845d60a5731bc127aa8","totalPrice":25,"__v":0,"imageAddress":"/assets/images/cola.png","name":"Sprite","priceSingle":5},{"_id":"5bf6db55f16f3529e0cd4d7e","productID":"5bf6a84cd10a8c365ce8374d","amount":12,"cartID":"5bf6c845d60a5731bc127aa8","totalPrice":24,"__v":0,"imageAddress":"/assets/images/water1.png","name":"Water 1L","priceSingle":2},{"_id":"5bf6d765d60a5731bc127aac","productID":"5bf6a859d10a8c365ce8374e","amount":1,"cartID":"5bf6c845d60a5731bc127aa8","totalPrice":2,"__v":0,"imageAddress":"/assets/images/water2.png","name":"Water 2L","priceSingle":2},{"_id":"5bf6d777d60a5731bc127aad","productID":"5bf6a873d10a8c365ce8374f","amount":5,"cartID":"5bf6c845d60a5731bc127aa8","totalPrice":50,"__v":0,"imageAddress":"/assets/images/grapejuice.png","name":"Grape Juice","priceSingle":10},{"_id":"5bf6dba6f16f3529e0cd4d7f","productID":"5bf6a895d10a8c365ce83750","amount":1,"cartID":"5bf6c845d60a5731bc127aa8","totalPrice":14,"__v":0,"imageAddress":"/assets/images/lemonjuice.png","name":"Lemon Juice","priceSingle":14}]}
_____


Get all cart items by cartID - GET request

5bf1af9d8052e7676cc23b3e - testt user ID

curl -v -X GET -H "xx-auth: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbklkIjoiNWJmMWFmOWQ4MDUyZTc2NzZjYzIzYjNlIiwiaWF0IjoxNTQyNTY1ODQyfQ.ku55pJMYwwuugNMwUr-PAS14KV4bQJcNoiWHPQdlTi8" localhost:6200/api/cartitems/5bf1af9d8052e7676cc23b3e

Response:

< HTTP/1.1 200 OK
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< Access-Control-Allow-Methods: GET,PUT,POST,DELETE
< Access-Control-Allow-Headers: Content-Type, xx-auth
< Content-Type: application/json; charset=utf-8
< Content-Length: 1340
< ETag: W/"53c-hrptd8r3nBSKNaXrQqyHMEFapZo"
< Date: Thu, 22 Nov 2018 17:12:16 GMT
< Connection: keep-alive
<
{"cartitems":[{"_id":"5bf6c845d60a5731bc127aa9","productID":"5bf1bed299f5d908e812354e","amount":5,"cartID":"5bf6c845d60a5731bc127aa8","totalPrice":40,"__v":0,"imageAddress":"test","name":"Tnuva Milk","priceSingle":8},{"_id":"5bf6c8f0d60a5731bc127aaa","productID":"5bf6a253d10a8c365ce8374c","amount":5,"cartID":"5bf6c845d60a5731bc127aa8","totalPrice":25,"__v":0,"imageAddress":"/assets/images/cola.png","name":"Sprite","priceSingle":5},{"_id":"5bf6db55f16f3529e0cd4d7e","productID":"5bf6a84cd10a8c365ce8374d","amount":12,"cartID":"5bf6c845d60a5731bc127aa8","totalPrice":24,"__v":0,"imageAddress":"/assets/images/water1.png","name":"Water 1L","priceSingle":2},{"_id":"5bf6d765d60a5731bc127aac","productID":"5bf6a859d10a8c365ce8374e","amount":1,"cartID":"5bf6c845d60a5731bc127aa8","totalPrice":2,"__v":0,"imageAddress":"/assets/images/water2.png","name":"Water 2L","priceSingle":2},{"_id":"5bf6d777d60a5731bc127aad","productID":"5bf6a873d10a8c365ce8374f","amount":5,"cartID":"5bf6c845d60a5731bc127aa8","totalPrice":50,"__v":0,"imageAddress":"/assets/images/grapejuice.png","name":"Grape Juice","priceSingle":10},{"_id":"5bf6dba6f16f3529e0cd4d7f","productID":"5bf6a895d10a8c365ce83750","amount":1,"cartID":"5bf6c845d60a5731bc127aa8","totalPrice":14,"__v":0,"imageAddress":"/assets/images/lemonjuice.png","name":"Lemon Juice","priceSingle":14}]}* Connection #0 to host localhost left intact
*/



/*

Delete cart item by cart item ID - DELETE request

5bf3c55207a0440690537884

curl -v -X DELETE -H "xx-auth: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbklkIjoiNWJmMWFmOWQ4MDUyZTc2NzZjYzIzYjNlIiwiaWF0IjoxNTQyNTY1ODQyfQ.ku55pJMYwwuugNMwUr-PAS14KV4bQJcNoiWHPQdlTi8" localhost:6200/api/cartitems/5bf3ebd17278ab0a7ca8f0a2

reponse:

< HTTP/1.1 200 OK
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< Access-Control-Allow-Methods: GET,PUT,POST,DELETE
< Access-Control-Allow-Headers: Content-Type, xx-auth
< Content-Type: text/html; charset=utf-8
< Content-Length: 8
< ETag: W/"8-1z6ssizdlKMf7K4C7nfIUlQscuk"
< Date: Tue, 20 Nov 2018 11:17:49 GMT
< Connection: keep-alive
<
{"cartitems":[{"_id":"5bfe706c4c97ac00155af0e4","productID":"5bfd47e102dc4f0015b9e5d7","amount":1,"cartID":"5bfe470c4fbbae0015b88414","totalPrice":10,"__v":0,"imageAddress":"/assets/images/tnuvamilk.png","name":"Tnuva","priceSingle":10}]}* Connection #0 to host localhost left intact

*/

/*

Update Cart Item - PUT Request

curl -v -X PUT -H "Content-type: application/json" -H "xx-auth: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbklkIjoiNWJmMWFmOWQ4MDUyZTc2NzZjYzIzYjNlIiwiaWF0IjoxNTQyNTY1ODQyfQ.ku55pJMYwwuugNMwUr-PAS14KV4bQJcNoiWHPQdlTi8" -d  "{\"amount\":30, \"userID\":\""5bf1af9d8052e7676cc23b3e"\"}" localhost:6200/api/cartitems/5bf6db55f16f3529e0cd4d7e

Response:

< HTTP/1.1 200 OK
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< Access-Control-Allow-Methods: GET,PUT,POST,DELETE
< Access-Control-Allow-Headers: Content-Type, xx-auth
< Content-Type: application/json; charset=utf-8
< Content-Length: 146
< ETag: W/"92-fuzI/iJgjEog2bOCR15KgDwsYHc"
< Date: Wed, 21 Nov 2018 08:30:58 GMT
< Connection: keep-alive
<
{"cartitems":[{"_id":"5bf6c845d60a5731bc127aa9","productID":"5bf1bed299f5d908e812354e","amount":5,"cartID":"5bf6c845d60a5731bc127aa8","totalPrice":40,"__v":0,"imageAddress":"test","name":"Tnuva Milk","priceSingle":8},{"_id":"5bf6c8f0d60a5731bc127aaa","productID":"5bf6a253d10a8c365ce8374c","amount":5,"cartID":"5bf6c845d60a5731bc127aa8","totalPrice":25,"__v":0,"imageAddress":"/assets/images/cola.png","name":"Sprite","priceSingle":5},{"_id":"5bf6db55f16f3529e0cd4d7e","productID":"5bf6a84cd10a8c365ce8374d","amount":6,"cartID":"5bf6c845d60a5731bc127aa8","totalPrice":12,"__v":0,"imageAddress":"/assets/images/water1.png","name":"Water 1L","priceSingle":2},{"_id":"5bf6d765d60a5731bc127aac","productID":"5bf6a859d10a8c365ce8374e","amount":1,"cartID":"5bf6c845d60a5731bc127aa8","totalPrice":2,"__v":0,"imageAddress":"/assets/images/water2.png","name":"Water 2L","priceSingle":2},{"_id":"5bf6d777d60a5731bc127aad","productID":"5bf6a873d10a8c365ce8374f","amount":10,"cartID":"5bf6c845d60a5731bc127aa8","totalPrice":100,"__v":0,"imageAddress":"/assets/images/grapejuice.png","name":"Grape Juice","priceSingle":10},{"_id":"5bf6dba6f16f3529e0cd4d7f","productID":"5bf6a895d10a8c365ce83750","amount":1,"cartID":"5bf6c845d60a5731bc127aa8","totalPrice":14,"__v":0,"imageAddress":"/assets/images/lemonjuice.png","name":"Lemon Juice","priceSingle":14}]}
*/