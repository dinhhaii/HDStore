var express = require('express');
var router = express.Router();
var hbscontent = require('../app');
var categoryModel = require('../models/category.model');
var productModel = require('../models/product.model');

router.get('/', (req,res,next) => {
    if(hbscontent.isAdmin == true){
        res.redirect('/admin');
    }
    else{
        hbscontent.title = "Trang chủ";
        if(hbscontent['paymentsuccess'] == true){
            hbscontent['paymentsuccess'] = false;
            hbscontent.cart = [];
        }
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

module.exports = router;