var express = require('express');
var router = express.Router();
var hbscontent = require('../app');
var categoryModel = require('../models/category.model');
var productModel = require('../models/product.model');
var userModel = require('../models/user.model');

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

router.get('/forgotpassword', (req, res) => {
    res.render('forgotpassword', {
        layout: false,
        title: "Quên mật khẩu",
        isErrorEmail: false,
        isErrorConfirmpassword: false,
        isErrorFinish: false
    });
});

router.post('/forgotpassword', (req, res, next) => {
    var account = req.body;
    console.log(account);
    userModel.findByUsername(account.username)
    .then(rows => {
        if (rows.length > 0)
        {   
            console.log(rows);
            var entity = rows[0];
            if (entity.email != account.email)
            {
                res.render('forgotpassword', {
                    layout: false,
                    isErrorFinish: false,
                    isErrorEmail: true,
                    isErrorConfirmpassword: false,
                });
            }
            else 
            {
                if (account.password != account.confirmpassword)
                {
                    res.render('forgotpassword', {
                        layout: false,
                        isErrorFinish: false,
                        isErrorEmail: false,
                        isErrorConfirmpassword: true,
                    });
                }
                else 
                {
                    entity.password = account.password;
                    delete entity['confirmpassword'];
                    console.log(entity);
                    userModel.update(entity).then().catch(next);
                    res.redirect('/login');
                }
            }
            
        }
        else 
        {
            res.render('forgotpassword', {
                layout: false,
                isErrorFinish: true,
                isErrorEmail: false,
                isErrorConfirmpassword: false,
            });
        }
        
    })
    .catch(next);
})

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