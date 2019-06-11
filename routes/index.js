var express = require('express');
var router = express.Router();
var hbscontent = require('../app');
var categoryModel = require('../models/category.model');

router.get('/', (req,res,next) => {
    hbscontent.title = "Trang chủ";
    categoryModel.all()
    .then(rows => {
        hbscontent['categories'] = rows;
        res.render('index', hbscontent);
    })
    .catch(next);
});

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