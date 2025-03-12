const User = require("../models/user");
const bcrypt = require("bcrypt");
const path = require("path");

const loginPage = (req, res) => {
    if (!req.session.user) {
        return res.sendFile(path.join(__dirname,"../public", "login.html"));
    }
    if(req.session.user.role == "admin"){
        return res.redirect("/admin.html");
    }
    else {
        return res.redirect("/user.html");
    }
}

const register = async (req, res) => {
    const { username, password, role } = req.body;
    
    try {
        await new User({  username: username, password : password, role : role  }).save();
        res.send("User registered!");
    } catch (error) {
        res.send("Error: " + error.message);
    }
}

const login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.json({ success: false, message: "Invalid credentials" });
    }

    req.session.user = user;

    if (user.role === "admin") {
        res.json({ success: true, redirect: "admin.html" });
    } else {
        res.json({ success: true, redirect: "user.html" });
    }
}

const user = (req, res) => {
    if (!req.session.user || req.session.user.role !== "user") {
        return res.redirect("/login.html");
    }
    res.sendFile(path.join(__dirname, "../protected", "user.html"));
}

const admin = (req, res) => {
    if (!req.session.user || req.session.user.role !== "admin") {
        return res.redirect("/login.html");
    }
    res.sendFile(path.join(__dirname,"../protected", "admin.html"));
}

const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login.html");
    });
}

module.exports = {
    loginPage,
    register,
    login,
    user,
    admin,
    logout
}