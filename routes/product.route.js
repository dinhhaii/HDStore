var express = require('express');
var router = express.Router();

var productTagModel = require('../models/product-tag.model');
var productModel = require('../models/product.model');
var categoryModel = require('../models/category.model');
var hbscontent = require('../app');


router.get('/:id', (req, res, next) => {
    var id = req.params.id; 

    productModel.single(id)
    .then(products => {
        if(products.length > 0){  
            //Quan ly 1 san pham   
            var product = products[0];
            //Kiem tra khuyen mai
            if(product.discount != 0){
                product['isDiscounted'] = true;
                product['promotionprice'] = product.price * (100 - product.discount) / 100;
            }
            else{
                product['isDiscounted'] = false;
            }
            //Kiem tra tinh trang
            if(product.condition == "Hết hàng"){
                product['isOutOfStock'] = true;
            }
            else{
                product['isOutOfStock'] = false;
            }

            hbscontent['product'] = product;
            hbscontent['title'] = product.titleproduct;
            var idcat = product.idcategory;
            Promise.all([
                productTagModel.allTagByproduct(product.id),
                categoryModel.single(idcat)
            ])            
            .then(([producttags,categories]) => {
                hbscontent['producttags'] = producttags;

                if (categories.length > 0) {            
                    var namecat = categories[0].name;
                    hbscontent['idcat'] = idcat;
                    hbscontent['namecategory'] = namecat;

                    res.render('singleproduct', hbscontent);
                }
            }).catch(next);
        }
    }).catch(next);
});

module.exports = router;