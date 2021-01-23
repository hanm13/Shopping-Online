const category = require('../00_models/category');
const managerMiddlware = require('./middlewares/manager');

let init = (app) => {

    category.CategoryModel.count({})
    .then(counter=>{
        if(!counter){
            category.CategoryModel.insertMany(require("./../00_models/categories.json")) // will insert categories by default
        }
    });

    // Get categories - ALL - EVERY CLIENT CAN ACCESS: 
    app.get("/api/categories", (req, res) => {

        category.CategoryModel.find({})
        .then(categories => {
            res.status(200).send(JSON.stringify(categories));
        })
        .catch((e) => { res.status(400).send(e) });
    
    });

    app.post("/api/categories", managerMiddlware.middleware, (req, res) => {
        
        let newCategory = new category.CategoryModel(req.body);
        newCategory.save()
            .then(() => res.status(200).send(newCategory))
            .catch((e) => res.status(400).send(e));

    })

}

module.exports = { init }

/*

Get all Categories - Get Request

CURL : curl -v -X GET localhost:6200/api/categories

Response:

< HTTP/1.1 200 OK
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< Access-Control-Allow-Methods: GET,PUT,POST,DELETE
< Access-Control-Allow-Headers: Content-Type, xx-auth
< Content-Type: text/html; charset=utf-8
< Content-Length: 117
< ETag: W/"75-MocRHWcMAWDYNtTwABQFOihvh6U"
< Date: Sun, 18 Nov 2018 18:36:33 GMT
< Connection: keep-alive
<
[{"_id":"5bf1b03f8052e7676cc23b3f","name":"Milk","__v":0},{"_id":"5bf1b12e8d1faa0d40ddb711","name":"Drinks","__v":0}]* Connection #0 to host localhost left intact

___

Create new Category - Post Request as user:manager

We send the manager xx-auth.

POST - localhost:6200/api/categories

curl -v -X POST -H "Content-type: application/json" -H "xx-auth: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbklkIjoiNWJmMWFmOWQ4MDUyZTc2NzZjYzIzYjNlIiwiaWF0IjoxNTQyNTY1ODQyfQ.ku55pJMYwwuugNMwUr-PAS14KV4bQJcNoiWHPQdlTi8" -d  "{\"name\":\"Milk\"}" localhost:6200/api/categories

Response: 

* upload completely sent off: 15 out of 15 bytes
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< Access-Control-Allow-Methods: GET,PUT,POST,DELETE
< Access-Control-Allow-Headers: Content-Type, xx-auth
< Content-Type: application/json; charset=utf-8
< Content-Length: 56
< ETag: W/"38-t7cGvggdm75XRzwK9pDnY5IrZ4c"
< Date: Sun, 18 Nov 2018 18:32:31 GMT
< Connection: keep-alive
<
{"_id":"5bf1b03f8052e7676cc23b3f","name":"Milk","__v":0}* Connection #0 to host localhost left intact

*/
