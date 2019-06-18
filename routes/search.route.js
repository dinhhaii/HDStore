var express = require('express');
var router = express.Router();
var hbscontent = require('../app');
var productModel = require('../models/product.model');

router.get('/', (req, res, next) =>{    
    var content = hbscontent['keyword'];
    var page = req.query.page || 1;
    if(page < 1) page = 1;
    var limit = 3;
    var offset = (page - 1) * limit;

    Promise.all([
        productModel.pagingSearch(content, limit, offset),
        productModel.countSearchResult(content)
    ]).then(([searchResults,count_searchResults])  => {
        console.log(searchResults);
        searchResults.forEach(element => {
            if(element.condition == "Hết hàng"){
                element['isOutOfStock'] = true;
            }
            else{
                element['isOutOfStock'] = false;
            }
            if(element.discount != 0){
                element['isDiscounted'] = true;
                element['promotionprice'] = element.price * (100 - element.discount) / 100;
            }
            else{
                element['isDiscounted'] = false;
            }
        });
        var total = count_searchResults[0].total;
        console.log(total);
        var npages = Math.floor(total / limit);
        if(total % limit > 0) npages++;

        var pages = [];
        for(i = 1; i <= npages; i++){
            var obj = {value: i, active: i === +page};
            pages.push(obj);
        }
        console.log(pages);
        hbscontent.currentPage = req.protocol + '://' + req.get('host') + req.originalUrl;
        hbscontent.title = `"${content}"`;
        hbscontent['searchResults'] = searchResults;
        hbscontent['pages'] = pages;

        res.render('searchlist', hbscontent);
    }).catch(next);    
    
})

router.post('/', (req, res, next) =>{
    hbscontent['keyword'] = req.body.keyword;
    res.redirect('/search');
})

module.exports = router;