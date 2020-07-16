const mongoose = require("mongoose");
const express = require("express")
const bodyparser = require("body-parser")
const cookieparser = require("cookie-parser")
const cors = require("cors")

const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")
const categoryRoutes = require("./routes/category")
const productRoutes = require("./routes/product")
const orderRoutes = require("./routes/order")

require("dotenv").config()

const port = 8000

const app = express()


// Db connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("DB CONNECTED")
})
// This is Middleware
app.use(bodyparser.json());
app.use(cookieparser());
app.use(cors());

//Routes
app.use("/api", authRoutes)
app.use("/api", userRoutes)
app.use("/api", categoryRoutes)
app.use("/api", productRoutes)
app.use("/api", orderRoutes)


app.get("/apiadd", (req, res) => {
    return res.send("This is test api.")
})

// port
app.listen(port, (req, res) => {
    console.log(`app is running at ${port}`)
})