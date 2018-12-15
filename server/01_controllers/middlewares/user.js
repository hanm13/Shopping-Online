const jwt = require('jsonwebtoken');
const user = require('../../00_models/user');

let userMiddlware = (req, res, nextStep) => {
    let headerVal = req.header('xx-auth');
    if (headerVal) {

        let decodedId;
        try {
            decodedId = (jwt.verify(headerVal, 'my secret')).tokenId;
        } catch (e) {
            res.status(401).send("invalid token in this request");
        }

        user.UserModel.count({
                "_id": decodedId
            }).then(counter => {
                if (counter) {
                    req.params._id = decodedId;
                    req.params.userID = decodedId;
                    req.body.userID = decodedId;
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

module.exports = { "middleware":userMiddlware }