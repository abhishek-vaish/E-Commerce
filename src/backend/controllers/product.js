const Product = require("../models/product")
const formidable = require("formidable")
const _ = require("lodash")
const fs = require("fs")
const product = require("../models/product")

exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
        .populate("category")
        .exec((err, product) => {
        if(err){
            return res.status(400).json({
                error : "No product found with the given id"
            })
        }
        req.product = product
        next();
    })
}

exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error : "problem with image"
            })
        }

        //destructure the fields
        const {price, description, category, name, stock} = fields

        if( !name || !description || !price || !category || !stock)
        {
            res.status(400).json({
                error : "Please include all required fields"
            })
        }



        //TODO : restriction on fields
        let product = new Product(fields)

        //handle file here
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error : "file size is too big"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }
        // console.log(product)

        //save photo to the database
        product.save((err, product) => {
            if(err){
                return res.status(400).json({
                    error : "unable to save photo to database"
                })
            }
            res.json(product)
        })
    })
}

exports.getProduct = (req, res) => {
    req.product.photo = undefined
    return res.json(req.product)
}

exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error : "problem with image"
            })
        }
        let product = req.product
        product = _.extend(product, fields)

        //handle file here
        if(file.photo){
            if(file.photo.size > 3000000000){
                return res.status(400).json({
                    error : "file size is too big"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }
        // console.log(product)

        //save photo to the database
        product.save((err, product) => {
            if(err){
                return res.status(400).json({
                    error : "updation failed in product"
                })
            }
            res.json(product)
        })
    })
}

exports.deleteProduct = (req, res) => {
    const product = req.product
    product.remove((err, deletedProduct) => {
        if(err){
            return res.status(400).json({
                error : "Unable to delete the product"
            })
        }
        res.json({
            message : deletedProduct
        })
    })
}


exports.getAllProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id"
    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
        if(err){
            return res.status(400).json({
                error : "No product found"
            })
        }
        res.json({ products })
    })
}

exports.updateStock = (req,res,next) => {
    let myOpertaion = req.body.order.products.map(prod => {
        return {
            updateOne : {
                filter : {_id : prod._id},
                update : {$inc : {stock : -prod.count, sold : +prod.count}}
            }
        }
    })

    Product.bulkWrite(myOpertaion, {}, (err, products) => {
        if(err) {
            return res.status(400).json({
                error : "Bulk opertaion failed"
            })
        }
        next();
    })
}


exports.getAllUniqueCategory = (req, res) => {
    Product.distinct("category", {}, (err, category) => {
        if(err){
            return res.status(400).json({
                error : "No category found"
            })
        }
        res.json( {category} )
    })
}


//MiddleWare
exports.photo = (req, res, next) => {
    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next();
}
