var express = require('express');
var router = express.Router();
var hbscontent = require('../app');
var categoryModel = require('../models/category.model');
var productModel = require('../models/product.model');
var cartModel = require('../models/cart.model');
var detailCartModel = require('../models/detailcart.model');

router.get('/', (req,res,next) => {
    if(hbscontent.isAdmin == true){
        res.redirect('/admin');
    }
    else{
        hbscontent.title = "Trang chủ";
        hbscontent.cart = [];
        Promise.all([
            categoryModel.all(),
            productModel.latestproduct(9),
            productModel.latestproduct(3),
        ])      
        .then(([categories,newproducts, carouselproducts]) => {
            carouselproducts[0]['active'] = true;

            hbscontent['carouselproducts'] = carouselproducts;
            hbscontent['categories'] = categories;
            hbscontent['newproducts'] = newproducts;           
            
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
    hbscontent.cart = [];
    res.redirect('/');
})

router.get('/contact', (req, res) => {
    res.render('contact');
});

router.get('/cart', (req, res) => {
    res.render('cart', hbscontent);
});

router.get('/cart/:productid', (req, res, next) => {
    var productid = req.params.productid;
    productModel.single(productid)
    .then(rows => {
        hbscontent.cart.push(rows[0]);
    }).catch(next);

    var sum = 0;
    hbscontent.cart.forEach(element => {
        sum += element.price * (100 - element.discount) / 100;
    });
    hbscontent['sumbill'] = sum;
    hbscontent['discountbill'] = 0;
    hbscontent['totalbill'] = hbscontent['sumbill'] * (100 - hbscontent['discountbill']) / 100;

    res.redirect('/cart');
});

module.exports = router;