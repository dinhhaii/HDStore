var express = require('express');
var router = express.Router();
var hbscontent = require('../app');
var userModel = require('../models/user.model');

router.get('/', (req, res) => {
    res.render('login', {
        layout: false,
        title: "Đăng nhập"
    });
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
                    res.render('index', hbscontent);
                }
                else {
                    next();
                }
            }
            else {
                next();
            }
        })
        .catch(next);

});

module.exports = router;
