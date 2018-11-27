
    
    const user = require('../../00_models/user');
    
    let userExistsMiddleWare = (req, res, nextStep) => {

        let errors = [];

        user.UserModel.count({
            "personID": req.body.personID
        }).then(counter => {
            if (counter) {
                res.status(401).send({success:false, msg:["User is already exists with this ID!"]});
            } else {

                user.UserModel.count({
                    "userName": req.body.userName
                }).then(counter => {

                    if (counter) {

                        res.status(401).send( {success:false, msg:["User is already exists with this email!"]});

                    }else{

                        nextStep();

                    }

                })
                .catch((e) => {
                    res.status(401).send({success:false, msg:["User is already exists with this email!"]});
                });  
                
                
            }

        })
        .catch((e) => {
            res.status(401).send({success:false, msg:["User is already exists with this ID!"]});
        });        

    };

    module.exports = { "middleware":userExistsMiddleWare }