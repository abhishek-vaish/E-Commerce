const User = require("../models/user")
const Order = require("../models/order");
const user = require("../models/user");


exports.getUserById = (req, res, next, id) =>{
    User.findById(id).exec((err, user) => {
        if(err || !user){
            return res.status(400).json({
                error : "No user found in database"
            })
        }
        req.profile = user
        next();
    });
};

exports.getUser = (req, res) => {
    // TODO: get back here for password
    req.profile.salt = undefined
    req.profile.encry_password = undefined
    return res.json(req.profile)
}

exports.getUpdate = (req, res) => {
    User.findByIdAndUpdate(
        {_id : req.profile.id},
        {$set: req.body},
        {new: true, useFindAndModify : false},
        (err, user) => {
            if(err){
                return res.status(400).json({
                    error : "you cannot change the user information."
                })
            }
            req.profile.salt = undefined
            req.profile.encry_password = undefined
            res.json(user);
        }
    )
}


exports.userPurchaseList = (req, res) => {
    Order.find({user : req.profile._id}).populate("user", "_id name")
        .exec((err, order) => {
            if(err){
                return res.status(400).json({
                    error : "No Order found!!!"
                })
            }
            res.json(order);
        })
}

exports.pushOrderInPurchaseList = (req, res, next) => {

    let purchases = [];
    req.body.order.products.forEach(product => {
        purchases.push({
            _id : product._id,
            name : product.name,
            description : product.description,
            category : product.category,
            quantity : product.quantity,
            amount : product.amount,
            transaction_id : product.transaction_id
        })
    });

    //store this into database
    User.findOneAndUpdate(
        {_id : user.profile._id},
        {$push : {purchases : purchases}},
        {new : true},
        (err, purchase) => {
            if(err){
                res.status(400).json({
                    error : "unable to save purchase list"
                })
            }
            next();
        } 
    )
}


// exports.getallusers = (req, res) => {
//     User.find().exec((err, user) => {
//         if(err || !user){
//             return res.status(400).json({
//                 error : "getalluser : Error!!!"
//             })
//         }
//         res.json(user)
//     })
// }