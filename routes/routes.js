const express = require('express');
const router = express.Router();
const User = require('../models/user');
const multer = require('multer');

//image upload
var storage = multer.diskStorage({
    destination: function(req, file,cb){
        cb(null, './uploads');
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname+"_"+Date.now()+"_"+file.originalname);
    },
});

var upload = multer({
    storage: storage,
}).single("image");

router.post("/add", upload, async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: req.file.filename,
        });
        await user.save();
        req.session.message = {
            type: "success",
            message: "User added successfully!",
        };
        res.redirect("/");
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});

router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.render('index', {title:"Home Page", users});
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});


router.get("/add", async (req, res) => {
    res.render('add_users', {title:"Add users"});
});

module.exports = router;