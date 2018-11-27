const jwt = require('jsonwebtoken');
const product = require('../00_models/product');
const user = require('./../00_models/user');
const managerMiddlware = require("./middlewares/manager")

let init = (app) => {

    // Get products - ALL - EVERY CLIENT CAN ACCESS: 
    app.get("/api/products/:q", (req, res) => {

        let regex= new RegExp(req.params.q || "a" ,"i");

        product.ProductModel.find({"name":regex})
        .then(products => {
            res.status(200).send(JSON.stringify({"items":products}));
        })
        .catch((e) => { res.status(400).send(e) });
       
    });

    // Get products count
    app.get("/api/count/products", (req, res) => {
        
        product.ProductModel.count({})
        .then(counter=>{

            res.status(200).send(JSON.stringify({counter:counter}));
            
            
        })
        .catch((e) => { res.status(400).send(e) });
        
    });


    // Get products - BY Product ID - EVERY CLIENT CAN ACCESS: 
    app.get("/api/products/id/:q", (req, res) => {
        product.ProductModel.findOne({"id":req.params.q})
            .then(product => {
                res.status(200).send(product);
            })
            .catch((e) => { res.status(400).send(e) });
    });


    // add product - ONLY CLIENT THAT IS LOGED IN AS A MANAGER CAN ADD A NEW PRODUCT: 
    app.post("/api/products", managerMiddlware.middleware, (req, res) => {
       
            let newProduct = new product.ProductModel(req.body);
            newProduct.save()
                .then(() => res.status(200).send(newProduct))
                .catch((e) => res.status(400).send(e));
       
    })

    // Get products by category ID
    app.get("/api/products/category/:q", (req, res) => {

        product.ProductModel.find({"categoryId":req.params.q})
        .then(products => {
            res.status(200).send(JSON.stringify({"items":products}));
        })
        .catch((e) => { res.status(400).send(e) });
    });

    // Update product by ID

    app.put("/api/products/:q", managerMiddlware.middleware, (req, res) =>{

        product.ProductModel.findOne({_id: req.params.q})
        .then(product => {

            product.name = req.body.name;
            product.price = req.body.price;
            product.categoryId = req.body.categoryId;
            product.imageAddress = req.body.imageAddress;
            product.save();
            res.status(200).send(product);
        })
        .catch(err => res.status(400).send(err));
    
    });

    app.delete("/api/products/:q", managerMiddlware.middleware, (req, res) =>{

        product.ProductModel.deleteOne({_id: req.params.q})
        .then(() => {

            res.status(200).send("Deleted!");
        })
        .catch(err => res.status(400).send(err));
    
    });

}

module.exports = { init }

/*

If we dont have products we will use the template(products.json) and insert test item to the products collection.

Get all products - Get Request

curl -v -X GET localhost:6200/api/products/a

C:\Users\hanm15>curl -v -X GET localhost:6200/api/products/a

< HTTP/1.1 200 OK
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< Access-Control-Allow-Methods: GET,PUT,POST,DELETE
< Access-Control-Allow-Headers: Content-Type, xx-auth
< Content-Type: text/html; charset=utf-8
< Content-Length: 146
< ETag: W/"92-TaxLVdHCxbzvxQU8xXKgyIw7HzA"
< Date: Sun, 18 Nov 2018 18:56:04 GMT
< Connection: keep-alive
<
{"items":[{"_id":"5bf1b330920cea781490d22d","name":"Tnuva Milk","categoryId":"5bf1b03f8052e7676cc23b3f","price":8,"imageAddress":"test","__v":0}]}* Connection #0 to host localhost left intact


____

Get products count - GET request

curl -v -X GET localhost:6200/api/count/products

response:

< HTTP/1.1 200 OK
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< Access-Control-Allow-Methods: GET,PUT,POST,DELETE
< Access-Control-Allow-Headers: Content-Type, xx-auth
< Content-Type: text/html; charset=utf-8
< Content-Length: 13
< ETag: W/"d-SimcaLNdvljQISPgzmBIHcZlKo0"
< Date: Fri, 23 Nov 2018 10:32:44 GMT
< Connection: keep-alive
<
{"counter":7}* Connection #0 to host localhost left intact

____

Get products by category ID - Get Request

5bf1b03f8052e7676cc23b3f = Milk category

curl -v -X GET localhost:6200/api/products/category/5bf1b03f8052e7676cc23b3f


Reponse:

< HTTP/1.1 200 OK
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< Access-Control-Allow-Methods: GET,PUT,POST,DELETE
< Access-Control-Allow-Headers: Content-Type, xx-auth
< Content-Type: text/html; charset=utf-8
< Content-Length: 146
< ETag: W/"92-TaxLVdHCxbzvxQU8xXKgyIw7HzA"
< Date: Sun, 18 Nov 2018 18:59:54 GMT
< Connection: keep-alive
<
{"items":[{"_id":"5bf1b330920cea781490d22d","name":"Tnuva Milk","categoryId":"5bf1b03f8052e7676cc23b3f","price":8,"imageAddress":"test","__v":0}]}* Connection #0 to host localhost left intact


__________


Add new product - Post Request


POST - localhost:6200/api/products

5bf1b03f8052e7676cc23b3f = Milk category

xx-auth: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbklkIjoiNWJmMWFmOWQ4MDUyZTc2NzZjYzIzYjNlIiwiaWF0IjoxNTQyNTY1ODQyfQ.ku55pJMYwwuugNMwUr-PAS14KV4bQJcNoiWHPQdlTi8
User: manager.


curl -v -X POST -H "Content-type: application/json" -H "xx-auth: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbklkIjoiNWJmMWFmOWQ4MDUyZTc2NzZjYzIzYjNlIiwiaWF0IjoxNTQyNTY1ODQyfQ.ku55pJMYwwuugNMwUr-PAS14KV4bQJcNoiWHPQdlTi8" -d  "{\"name\":\"Cola\",\"price\": 5,\"imageAddress\":\"/images/cola.png\",\"categoryId\": \"5bf1b12e8d1faa0d40ddb711\"}" localhost:6200/api/products

* upload completely sent off: 101 out of 101 bytes
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< Access-Control-Allow-Methods: GET,PUT,POST,DELETE
< Access-Control-Allow-Headers: Content-Type, xx-auth
< Content-Type: application/json; charset=utf-8
< Content-Length: 140
< ETag: W/"8c-rx7GU930KSjE/5qJsk3tjYMO8w8"
< Date: Thu, 22 Nov 2018 12:32:09 GMT
< Connection: keep-alive
<
{"_id":"5bf6a1c9cbd3e368e43a2429","name":"Cola","price":5,"imageAddress":"/images/cola.png","categoryId":"5bf1b12e8d1faa0d40ddb711","__v":0}* Connection #0 to host localhost left intact

____

Edit/Update product - Put Request

Product: Yotvata Milk
_id: 5bf1bfa400098551e8e25c01

PUT - localhost:6200/api/products/:q

curl -v -X PUT -H "Content-type: application/json" -H "xx-auth: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbklkIjoiNWJmMWFmOWQ4MDUyZTc2NzZjYzIzYjNlIiwiaWF0IjoxNTQyNTY1ODQyfQ.ku55pJMYwwuugNMwUr-PAS14KV4bQJcNoiWHPQdlTi8" -d  "{\"name\":\"Yotvata Milk\",\"price\": 18,\"imageAddress\":\"test\",\"categoryId\": \"5bf1b03f8052e7676cc23b3f1\"}" localhost:6200/api/products/5bf1bfa400098551e8e25c01


response:

* upload completely sent off: 99 out of 99 bytes
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< Access-Control-Allow-Methods: GET,PUT,POST,DELETE
< Access-Control-Allow-Headers: Content-Type, xx-auth
< Content-Type: application/json; charset=utf-8
< Content-Length: 138
< ETag: W/"8a-v1U5JSeqCCgNd/FWKC0WwkvQKVE"
< Date: Sun, 18 Nov 2018 19:47:35 GMT
< Connection: keep-alive
<
{"_id":"5bf1bfa400098551e8e25c01","name":"Yotvata Milk","categoryId":"5bf1b03f8052e7676cc23b3f1","price":18,"imageAddress":"test","__v":0}* Connection #0 to host localhost left intact

/*

Delete product by productID

curl -v -X DELETE -H "xx-auth: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbklkIjoiNWJmMWFmOWQ4MDUyZTc2NzZjYzIzYjNlIiwiaWF0IjoxNTQyNTY1ODQyfQ.ku55pJMYwwuugNMwUr-PAS14KV4bQJcNoiWHPQdlTi8" localhost:6200/api/products/5bf1c28f2ef529256429f377

Reponse:

< HTTP/1.1 200 OK
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< Access-Control-Allow-Methods: GET,PUT,POST,DELETE
< Access-Control-Allow-Headers: Content-Type, xx-auth
< Content-Type: text/html; charset=utf-8
< Content-Length: 8
< ETag: W/"8-1z6ssizdlKMf7K4C7nfIUlQscuk"
< Date: Thu, 22 Nov 2018 13:09:59 GMT
< Connection: keep-alive
<
Deleted!* Connection #0 to host localhost left intact


*/
