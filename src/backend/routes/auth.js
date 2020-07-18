var express = require("express")
var router = express.Router()
const {signout, signup, signin, isSignedIn} = require("../controllers/auth")
const {check, validationResult} = require("express-validator")


router.post("/signup", [
    check('firstName').isLength({min: 3}).withMessage("Name should be atleast 3 char."),
    check('email').isEmail().withMessage("Email is required"),
    check('password').isLength({min: 3}).withMessage("Password should atleast 3 char.")
], signup)

router.post("/signin", [
    check('email').isEmail().withMessage("Email is required."),
    check('password').isLength({min: 3}).withMessage("Password should atleast 3 char.")
], signin)

router.get("/signout", signout);

router.get("/test", isSignedIn, (req, res) => {
    res.json(req.auth)
})

module.exports = router;