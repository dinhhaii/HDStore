var express = require('express');
var router = express.Router();

var userModel = require('../models/user.model');
var productModel = require('../models/product.model');
var categoryModel = require('../models/category.model');
var hbscontent = require('../app');


router.get('/:id', (req, res, next) => {
    var id = req.params.id;
    //Lấy name của category để làm title

    categoryModel.single(id).then(catrows => {
        if (catrows.length > 0) {
            hbscontent.title = catrows[0].name;         
        }
    }).catch(next);

    var page = req.query.page || 1;
    if(page < 1) page = 1;
    var limit = 3;
    var offset = (page - 1) * limit;
    
    Promise.all([
        productModel.pageByCat(id, limit, offset),
        productModel.countByCat(id)
    ]).then(([rows, count_rows]) => {   

        var total = count_rows[0].total;
        var npages = Math.floor(total / limit);
        if(total % limit > 0) npages++;

        var pages = [];
        for(i = 1; i <= npages; i++){
            var obj = {value: i, active: i === +page};
            pages.push(obj);
        }

        rows.forEach(element => {
            if(element.discount != 0){
                element['isDiscounted'] = true;
                element['promotionprice'] = element.price * (100 - element.discount) / 100;
            }
            else{
                element['isDiscounted'] = false;
            }
        });

        hbscontent['products'] = rows;
        hbscontent['idcategory'] = id;
        hbscontent['pages'] = pages;
        hbscontent.currentPage = req.protocol + '://' + req.get('host') + req.originalUrl;
        
        res.render('categorylist', hbscontent);
    })
    .catch(next);
});

module.exports = router;