const express = require("express");
const mongoose = require("./database/db");
const path = require("path");
const loginRoute = require("./routes/loginRoute")
const userRoute = require("./routes/userRoute")
const adminRoute = require("./routes/adminRoute")

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(express.static(path.join(__dirname, "public")))
app.use('/controllers', express.static(path.join(__dirname, 'controllers')));
app.use('/protected', express.static(path.join(__dirname, 'protected')));


app.use('/', loginRoute)
app.use('/', userRoute)
app.use('/', adminRoute)


app.listen(3000, () => console.log("Server running at http://localhost:3000"));