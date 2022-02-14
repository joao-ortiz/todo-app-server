const db = require("../models");
const User = db.user;

checkIfUserNameExists = (req, res, next) => {
    User.findOne({
        username: req.body.username
    }).exec((err, user) => {
        if(err) {
            res.status(500).send({message: err})
            return;
        }
        if (user) {
            res.status(400).send({message: "This username is already in use"});
            return;
        }
        next();
    })
}

module.exports = checkIfUserNameExists;