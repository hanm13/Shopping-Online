const jwt = require('jsonwebtoken');
const product = require('../../00_models/product');
const user = require('../../00_models/user');

let managerMiddlware=(req,res,nextStep)=>{
    let headerVal = req.header('xx-auth');
    if (headerVal) {

        let decodedId;
        try {
            decodedId = (jwt.verify(headerVal, 'my secret')).tokenId;
        } catch (e) {
            res.status(401).send("invalid token in this request");
        }

        user.UserModel.findOne({
                "_id": decodedId
            }).then(user => {
                if (user.userName=="manager" || user.role == 1) {
                    nextStep();
                } else {
                    res.status(401).send();
                }

            })
            .catch((e) => {
                res.status(401).send();
            });
    } else {
        res.status(401).send("please add a token to the request");
    }
};


module.exports = { "middleware":managerMiddlware }