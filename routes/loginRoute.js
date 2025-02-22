const express = require("express")
const app = express.Router()
require('dotenv').config();

const {loginPage, register, login, user, admin, logout} = require("../controllers/loginController")
const session = require("express-session");

app.use(express.json())
app.use(express.urlencoded({extended : true}));

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true
}));


app.get("/", loginPage);
app.post("/register", register);
app.post("/login", login);
app.get("/user.html", user);
app.get("/admin.html", admin);
app.get("/logout", logout);

module.exports = app
