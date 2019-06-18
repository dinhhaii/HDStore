var express = require('express');
var router = express.Router();
var hbscontent = require('../app');
var userModel = require('../models/user.model');

router.get('/', (req, res) => {
    if(hbscontent.isLogin == true){
        res.redirect('/');
    }
    else{
        res.render('login', {
            layout: false,
            title: "Đăng nhập",
            isErrorLogin: false
        });
    }    
});

router.post('/', (req, res, next) => {
    var account = req.body;
    userModel.findByUsername(account.username)
        .then(rows => {
            if (rows.length > 0) {
                var entity = rows[0];
                if (entity.password == account.password) {
                    hbscontent.isLogin = true;
                    hbscontent.username = entity.name;
                    hbscontent.currentIDUser = entity.id;
                    hbscontent.cart = [];
                    if(entity.position == 'admin'){
                        hbscontent.isAdmin = true;
                    }
                    // res.render('index', hbscontent);
                    res.redirect('/login');
                }
                else {
                    res.render('login',{
                        layout: false,
                        isErrorLogin: true
                    });
                }
            }
            else {
                res.render('login',{
                    layout: false,
                    isErrorLogin: true
                });
            }
        })
        .catch(next);

});

module.exports = router;
