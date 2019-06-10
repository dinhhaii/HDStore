var express = require('express');
var router = express.Router();

//var categoryModel = require('../../models/category.model');

router.get('/category', (req, res)=> {

    res.render('admin/category/admin-category', {
        isAdmin: true
    });
})

module.exports = router;