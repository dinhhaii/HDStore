var express = require('express');
var router = express.Router();
var categoryModel = require('../../models/category.model');
var tagModel = require('../../models/tag.model');
var userModel = require('../../models/user.model');
var hbscontent = require('../../app');

router.get('/', (req, res) => {
    hbscontent.title = 'Quản trị viên';
    hbscontent.isAdmin = true;
    hbscontent.currentPage = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.redirect('/admin/category');
});

// ================================>>> QUẢN LÝ THỂ LOẠI <<<================================

router.get('/category', (req, res)=> {
    categoryModel.allWithDetail()
    .then(rows => {
        hbscontent['categories'] = rows;
        rows.forEach(element => {
            categoryModel.update(element).then().catch(err => { console.log(err)});
        });
        res.render('admin/category/admin-category', hbscontent);
    }).catch(err => {
        console.log(err);
    });
})

router.get('/addcategory', (req, res)=>{
    res.render('admin/category/admin-addcategory', hbscontent);
});

router.post('/addcategory', (req, res)=>{
    var entity = req.body;
    entity['totalproduct'] = 0;
    entity['createddate'] = new Date();

    categoryModel.add(entity)
    .then(() => {
        res.redirect('/admin/category');
    })
    .catch(err => {
        console.log(err);
        res.end('Error occured');
    });
});

router.get('/editcategory/:id', (req, res) => {
    var id = req.params.id;
    categoryModel.single(id)
    .then(rows => {
        if(rows.length > 0){
            hbscontent['error'] = false;
            hbscontent['category'] = rows[0];
            res.render('admin/category/admin-editcategory', hbscontent);
        }
    })
    .catch(err => {
        hbscontent['error'] = true;
        console.log(err);
        res.end('Error occured');
    });
    
});

router.post('/editcategory', (req,res) => {
    var entity = req.body;
    categoryModel.update(entity)
    .then(() => {
        res.redirect('/admin/category');
    })
    .catch(err => {
        console.log(err);
        res.end('Error occured');
    });
    
});

router.post('/deletecategory', (req,res) => {
    categoryModel.delete(req.body.id)
    .then(() => {
        res.redirect('/admin/category');
    })
    .catch(err => {
        console.log(err);
        res.end('Error occured');
    });
    
});

// ================================>>> QUẢN LÝ NHÃN <<<================================

router.get('/tag', (req, res)=> {
    tagModel.all()
    .then(rows => {
        hbscontent['tags'] = rows;
        rows.forEach(element => {
            tagModel.update(element).then().catch(err => { console.log(err)});
        });
        res.render('admin/tag/admin-tag', hbscontent);
    }).catch(err => {
        console.log(err);
    });
})

router.get('/addtag', (req, res)=>{
    res.render('admin/tag/admin-addtag', hbscontent);
});

router.post('/addtag', (req, res)=>{
    var entity = req.body;
    entity['createddate'] = new Date();
    tagModel.add(entity)
    .then(() => {
        res.redirect('/admin/tag');
    })
    .catch(err => {
        console.log(err);
        res.end('Error occured');
    });
});

router.get('/edittag/:id', (req, res) => {
    var id = req.params.id;
    tagModel.single(id)
    .then(rows => {
        if(rows.length > 0){
            hbscontent['error'] = false;
            hbscontent['tag'] = rows[0];
            res.render('admin/tag/admin-edittag', hbscontent);
        }
    })
    .catch(err => {
        hbscontent['error'] = true;
        console.log(err);
        res.end('Error occured');
    });
    
});

router.post('/edittag', (req,res) => {
    var entity = req.body;
    tagModel.update(entity)
    .then(() => {
        res.redirect('/admin/tag');
    })
    .catch(err => {
        console.log(err);
        res.end('Error occured');
    });
    
});

router.post('/deletetag', (req,res) => {
    tagModel.delete(req.body.id)
    .then(() => {
        res.redirect('/admin/tag');
    })
    .catch(err => {
        console.log(err);
        res.end('Error occured');
    });
    
});

// ================================>>> QUẢN LÝ NGƯỜI DÙNG <<<================================

router.get('/user', (req, res)=> {
    userModel.all()
    .then(rows => {
        hbscontent['users'] = rows;
        rows.forEach(element => {
            userModel.update(element).then().catch(err => { console.log(err)});
        });
        res.render('admin/user/admin-user', hbscontent);
    }).catch(err => {
        console.log(err);
    });
})

router.get('/adduser', (req, res)=>{
    res.render('admin/user/admin-adduser', hbscontent);
});

router.post('/adduser', (req, res)=>{
    var entity = req.body;
    entity['createddate'] = new Date();
    userModel.add(entity)
    .then(() => {
        res.redirect('/admin/user');
    })
    .catch(err => {
        console.log(err);
        res.end('Error occured');
    });
});

router.get('/edituser/:id', (req, res) => {
    var id = req.params.id;
    userModel.single(id)
    .then(rows => {
        if(rows.length > 0){
            hbscontent['error'] = false;
            hbscontent['user'] = rows[0];
            res.render('admin/user/admin-edituser', hbscontent);
        }
    })
    .catch(err => {
        hbscontent['error'] = true;
        console.log(err);
        res.end('Error occured');
    });
    
});

router.post('/edituser', (req,res) => {
    var entity = req.body;
    userModel.update(entity)
    .then(() => {
        res.redirect('/admin/user');
    })
    .catch(err => {
        console.log(err);
        res.end('Error occured');
    });
    
});

router.post('/deleteuser', (req,res) => {
    userModel.delete(req.body.id)
    .then(() => {
        res.redirect('/admin/user');
    })
    .catch(err => {
        console.log(err);
        res.end('Error occured');
    });
    
});

module.exports = router;