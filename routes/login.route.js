var express = require('express');
var router = express.Router();
var hbscontent = require('../app');
var userModel = require('../models/user.model');

router.get('/', (req,res) => {
    res.render('login', {
        layout: false, 
        title: "Đăng nhập"
    });
});

router.post('/', (req,res) => {
    var entity = req.body;
    console.log(req.body);
});

module.exports = router;
