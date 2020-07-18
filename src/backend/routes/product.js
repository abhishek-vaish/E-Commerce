const express = require("express")
const router = express.Router();

const {isAdmin, isAuthenticated, isSignedIn} = require("../controllers/auth")
const {getUserById} = require("../controllers/user");
const {getProductById, createProduct, getProduct, photo, updateProduct, deleteProduct, getAllProducts, getAllUniqueCategory} = require("../controllers/product");

router.param("userId", getUserById)
router.param("productId", getProductById)

router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct)
router.get("/product/:productId", getProduct)
router.get("/product/photo/:productId", photo)
router.put("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, updateProduct)
router.delete("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, deleteProduct)
router.get("/products", getAllProducts)
router.get("/products/category", getAllUniqueCategory)


module.exports = router;