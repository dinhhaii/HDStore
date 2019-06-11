var express = require('express');
var router = express.Router();
var hbscontent = require('../app');
var categoryModel = require('../models/category.model');

router.get('/', (req,res,next) => {
    if(hbscontent.isAdmin == true){
        res.redirect('/admin');
    }
    else{
        hbscontent.title = "Trang chủ";
        categoryModel.all()
        .then(rows => {
            hbscontent['categories'] = rows;
            res.render('index', hbscontent);
        })
        .catch(next);
    }
    
});

router.post('/logout', (req, res, next) => {
    hbscontent.isLogin = false;
    hbscontent.username = '';
    hbscontent.isAdmin = false;
    hbscontent.currentIDUser = 0;
    res.redirect('/');
})

router.use('/categorylist', (req, res) => {
    res.render('categorylist');
})

router.get('/singleproduct', (req,res) => {
    res.render('singleproduct');
 });

router.get('/signup', (req, res) => {
    res.render('signup', {layout: false});
});


router.get('/contact', (req, res) => {
    res.render('contact');
});

router.get('/cart', (req, res) => {
    res.render('cart');
});

module.exports = router;