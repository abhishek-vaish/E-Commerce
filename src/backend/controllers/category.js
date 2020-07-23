const Category = require("../models/category")


exports.getCategoryById = (req, res, next, id) => {

    Category.findById(id).exec((err, cate) => {
        if(err || !cate){
            return res.status(400).json({
                error : "Category not found in database"
            })
        }
        req.category = cate;
        next();
    });
};

exports.createCategory = (req, res) => {

    const category = new Category(req.body);
    category.save((err, category) => {
        if(err){
            return res.status(400).json({
                error : "unable to save category in database"
            })
        }
        res.json({ category });
    })
}

exports.getCategory = (req,res) => {
    return res.json( req.category )
}

exports.getAllCategory = (req,res) => {
    Category.find().exec((err, category) => {
        if(err){
            return res.status(400).json({
                error : "No Category found"
            })
        }
        res.json(category);
    })
}

exports.getUpdateCategory = (req, res) => {
    const category = req.category;
    category.name = req.body.name;

    category.save((err, updateCategory) => {
        if(err){
            return res.status(400).json({
                error : "unable to update the category"
            })
        }
        res.json(updateCategory);
    });
}

exports.getDeleteCategory = (req, res) => {
    const category = req.category;
    category.remove((err, deleteCategory) => {
        if(err){
            return res.status(400).json({
                error : "unable to delete the category"
            })
        }
        res.json({
            message : deleteCategory
        })
    })
}