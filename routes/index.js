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
        hbscontent.currentPage = req.protocol + '://' + req.get('host') + req.originalUrl;
        Promise.all([
            categoryModel.all(),
            productModel.latestproduct(9),
            productModel.latestproduct(3),
        ])      
        .then(([categories,newproducts, carouselproducts]) => {
            carouselproducts[0]['active'] = true;

            hbscontent['carouselproducts'] = carouselproducts;
            hbscontent['categories'] = categories;

            newproducts.forEach(element => {
                if(element.discount != 0){
                    element['isDiscounted'] = true;
                    element['promotionprice'] = element.price * (100 - element.discount) / 100;
                }
                else{
                    element['isDiscounted'] = false;
                }
            });
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
    hbscontent.title = "Liên lạc";
    hbscontent.currentPage = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.render('contact', hbscontent);
});

router.get('/cart', (req, res) => {
    var sum = 0;
    hbscontent.cart.forEach(element => {
        sum += element.numberofproduct * element.price * (100 - element.discount) / 100;
    });
    hbscontent['sumbill'] = sum;
    hbscontent['discountbill'] = 0;
    hbscontent['totalbill'] = hbscontent['sumbill'] * (100 - hbscontent['discountbill']) / 100;

    res.render('cart', hbscontent);
});

router.post('/cart/:productid', (req, res, next) => {
    var productid = req.params.productid;
    console.log(req.body);
    var numberofproduct = req.body.numberofproduct;
    if(numberofproduct == null || numberofproduct == ''){
        numberofproduct = 1;
    }
    else{
        numberofproduct = parseInt(numberofproduct);
    }
    hbscontent['checkInputNumberOfProduct'] = true;
    productModel.single(productid)
        .then(rows => {
            var product = rows[0];
            if (numberofproduct > product.amount) {
                hbscontent['checkInputNumberOfProduct'] = false;
            }
            if(hbscontent['checkInputNumberOfProduct']){
                res.redirect('/cart');
            }else{
                res.redirect(hbscontent.currentPage);
            }
            product['numberofproduct'] = numberofproduct;
            hbscontent.cart.push(product);
        }).catch(next);   
});

router.get('/cart/remove/:productid', (req, res, next) => {
    var productid = req.params.productid;
    for(var i =0;i<hbscontent.cart.length;i++){
        if(hbscontent.cart[i].id == productid){
            hbscontent.cart.splice(i,1);
        }
    }    
    res.redirect('/cart');
});

module.exports = router;