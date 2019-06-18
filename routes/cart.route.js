var express = require('express');
var router = express.Router();
var hbscontent = require('../app');
var productModel = require('../models/product.model');
var cartModel = require('../models/cart.model');
var detailCartModel = require('../models/detailcart.model');
var auth = require('../middlewares/auth');

router.get('/', auth, (req, res) => {
    var sum = 0;
    
    hbscontent.cart.forEach(element => {
        sum += element.numberofproduct * element.price * (100 - element.discount) / 100;
    });
    hbscontent['sumbill'] = sum;
    hbscontent['discountbill'] = 0;
    hbscontent['totalbill'] = hbscontent['sumbill'] * (100 - hbscontent['discountbill']) / 100;

    if(hbscontent['isSuccessPayment'] == true){
        hbscontent['paymentsuccess'] = true;
        hbscontent['isSuccessPayment'] = false;
    }else {
        hbscontent['paymentsuccess'] = false;
    }
    res.render('cart', hbscontent);
});

router.post('/:productid', auth, (req, res, next) => {
    var productid = req.params.productid;
    console.log(req.body);
    var numberofproduct = req.body.numberofproduct;
    console.log(numberofproduct == null);
    if(numberofproduct == null || numberofproduct == ''){
        numberofproduct = 1;
    }
    else{
        numberofproduct = parseInt(numberofproduct);
    }
    hbscontent['isWrongNumberProduct'] = false;
    productModel.single(productid)
        .then(rows => {
            var product = rows[0];
            if (numberofproduct > product.amount) {
                hbscontent['isWrongNumberProduct'] = true;
            }

            if(hbscontent['isWrongNumberProduct'] == false){
                product['numberofproduct'] = numberofproduct;
                hbscontent.cart.push(product);
                res.redirect('/cart');
            }
            else{
                res.redirect(hbscontent.currentPage);
            }
            
        }).catch(next);   
});

router.get('/remove/:productid', (req, res, next) => {
    var productid = req.params.productid;
    for(var i =0;i<hbscontent.cart.length;i++){
        if(hbscontent.cart[i].id == productid){
            hbscontent.cart.splice(i,1);
        }
    }    
    res.redirect('/cart');
});

router.get('/payment', (req, res, next) => {
    var productlist = hbscontent.cart;
    var cart = {
        iduser: hbscontent.currentIDUser,
        idpayment: 3,
        amount: productlist.length,
        discount: hbscontent.discountbill,
        discountedtotal: hbscontent.sumbill,
        total: hbscontent.totalbill        
    }

    cartModel.add(cart)
    .then(() => {
        cartModel.descCart()
        .then(rows => {
            var newestCart = rows[0];
            for(var i =0;i<productlist.length;i++){
                var entity = { 
                    idcart: newestCart.id,
                    idproduct: productlist[i].id
                }
                detailCartModel.add(entity).then().catch(next);
            }     
            hbscontent['isSuccessPayment'] = true;
            res.redirect('/cart');           
        })
        .catch(next);
    })
    .catch(next);
});

module.exports = router;