var express = require('express');
var router = express.Router();
var hbscontent = require('../app');
var userModel = require('../models/user.model');

router.get('/', (req, res) => {
    if(hbscontent.isLogin == true){
        res.redirect('/');
    }
    else{
        res.render('signup', {
            layout: false,
            title: "Đăng kí",
            isErrorSignup: false
        });
    }    
});

router.post('/', (req, res, next) => {
    var account = req.body;
    console.log(account);
    if(account.password != account.confirmpassword){
        console.log("HELLO");
        res.render('signup', {
            layout: false,
            isErrorSignup: true
        });
    }
    else{
        account['phone'] = 0;
        account['address'] = '';
        account['createddate'] = new Date();
        account['position'] = 'user';
        account['name'] = '';
        delete account['confirmpassword'];

        console.log(account);
        userModel.add(account)
        .then(() => {
            res.redirect('/login');
        })
        .catch(() => {
            res.render('signup', {
                layout: false,
                isErrorSignup: true
            });
        });
    }
    
});

module.exports = router;
