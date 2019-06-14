var express = require('express');
var router = express.Router();

var productModel = require('../models/product.model');
var tagModel = require('../models/tag.model');
var hbscontent = require('../app');
var product_tagModel = require('../models/product-tag.model');

router.get('/:id', (req, res) => {
    var id = req.params.id;
    tagModel.single(id).then(catrows => {
        if (catrows.length > 0) {
            hbscontent.title = catrows[0].name;         
        }
    })
    .catch(err => {
        console.log(err);
        res.end('Error occured1');
    });

    var page = req.query.page || 1;
    if(page < 1) page = 1;
    var limit = 3;
    var offset = (page - 1) * limit;
    
    Promise.all([
        product_tagModel.pageproductByTag(id, limit, offset),
        product_tagModel.countproductByTag(id)
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
        hbscontent['idtag'] = id;
        hbscontent['pages'] = pages;    
        hbscontent.currentPage = req.protocol + '://' + req.get('host') + req.originalUrl;
        
        res.render('tag', hbscontent);
    })
    .catch(err => {
        console.log(err);
        res.end('Error occured3');
    });
});

module.exports = router;