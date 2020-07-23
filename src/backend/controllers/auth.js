const User = require("../models/user")
const { check, validationResult, cookie} = require('express-validator')
const jwt = require('jsonwebtoken')
const expressjwt = require('express-jwt')


exports.signup = (req, res) => {

    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }

    const user = new User(req.body)
    user.save((err, user) => {
        if(err){
            return res.status(400).json({
                err : "NOT able to save user in database"
            })
        }
        res.json(user)
    })
};

exports.signin = (req, res) => {

    const { email, password } = req.body;

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    };

    User.findOne({email}, (err, user) => {
        if(err || !user){
            return res.status(400).json({
                error : "User doesn't match"
            })
        };
        if(!user.authenticate(password)){
            return res.status(401).json({
                error : "Password doesn't match",
            })
        };

        //create token
        const token = jwt.sign({_id: user._id}, process.env.SECRECT)
        //store it into cookie
        res.cookie("token", token, {expire : new Date() + 9999});
        //response to frontend
        const{_id, firstName, email, role} = user;
        return res.json({ token, 
            user : {_id, firstName, email, role}
        })
    })

}

exports.signout = (req, res) => {
    res.clearCookie("token")
    res.json({
        message: "User Signout successfully"
    })
}

exports.isSignedIn = expressjwt({
    secret: "learncodeonline",
    userProperty: "auth"
});

// Custom Middlewares
exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id
    if(!checker){
        return res.status(403).json({
            message : "isAuthenticated : Access Denied."
        })
    }
    next();
}

exports.isAdmin = (req, res, next) => {
    if(req.profile.role === 0){
        res.status(403).json({
            message : "isAdmin : You are not Admin."
        })
    }
    next();
}