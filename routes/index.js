var express = require('express');
var router = express.Router();
var hbscontent = require('../app');
var categoryModel = require('../models/category.model');
var productModel = require('../models/product.model');
var cartModel = require('../models/cart.model');
var detailcartModel = require('../models/detailcart.model');

router.get('/', (req,res,next) => {
    if(hbscontent.isAdmin == true){
        res.redirect('/admin');
    }
    else{
        hbscontent.title = "Trang chủ";
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
    res.redirect('/');
})

router.get('/singleproduct', (req,res) => {
    res.render('singleproduct');
});

router.get('/contact', (req, res) => {
    res.render('contact');
});

router.get('/cart/:id', (req, res) => {
    var id = req.params.id;
    console.log(id);
    cartModel.findIdUser(id)
    .then(rows => {
        var amountproduct = 0;
        var money = 0;
        detailcartModel.single(rows[0].id)
        .then(listidproduct => {
            listidproduct.forEach(element => {
                productModel.single(element.idproduct)
                .then(temps => {
                    hbscontent['products'] = temps;
                    if (element.discount == 0){
                        money = money + element.price;                        }
                    else {
                        money = money + (element.price*(100 - element.discount)/100);
                    }
                    amountproduct =  amountproduct + 1;
                })
                .catch(err => {
                    console.log(err);
                    res.end('Error occured1');
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.end('Error occured2');
        });
        hbscontent['cart'] = rows;
        if (amountproduct >= 5 && amountproduct <= 10)
        {
            rows.forEach(element => {
                element['amount'] = amountproduct;
                element['discount'] = 5;
                element['discountedtotal'] = money;
                element['total'] = (money*(100 - element.discount)/100);
                cartModel.update(element).then().catch(err => { console.log(err)});
            });
        }
        if (amountproduct < 5)
        {
            rows.forEach(element => {
                element['amount'] = amountproduct;
                element['discount'] = 0;
                element['discountedtotal'] = money;
                element['total'] = money;
                cartModel.update(element).then().catch(err => { console.log(err)});
            });
        }
        if (amountproduct > 10)
        {
            rows.forEach(element => {
                element['amount'] = amountproduct;
                element['discount'] = 10;
                element['discountedtotal'] = money;
                element['total'] = (money*(100 - element.discount)/100);
                cartModel.update(element).then().catch(err => { console.log(err)});
            });
        }
    res.render('cart', hbscontent);
    })
    .catch(err => {
        console.log(err);
        res.end('Error occured3');
    });
});

module.exports = router;