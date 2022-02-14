const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

const jwt = require("jsonwebtoken");
const bycript = require("bcryptjs");

const signUp = (req, res) => {
    const user = new User({
        username: req.body.username,
        password: bycript.hashSync(req.body.password, 8)
    });
    user.save((err, user) => {
        if(err) {
            res.status(500).send({ message: err})
            return;
        }
        res.send({ message: "User created successfully", user })
        return;
    })
}

const signIn = (req, res) => {
    User.findOne({
        username: req.body.username
    }).populate("projects")
        .exec((err, user) => {
            if(err) {
                 res.status(500).send({ message: err});
                 return;
            }
            if(!user) {
                return res.status(404).send({ message: "User not found." })
            }
            var passwordIsValid = bycript.compareSync(req.body.password, user.password);
             
            if(!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                  });
            }

            var token = jwt.sign({ id: user.id}, config.secret, {
                expiresIn: 86400
            });

            res.status(200).send({
                id: user._id,
                username: user.username,
                projects: user.projects,
                accessToken: token
            });
        });
};

module.exports = {
    signIn,
    signUp
}