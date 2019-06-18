var hbscontent = require('../app');
module.exports = (req, res, next) => {
    console.log(hbscontent.isLogin);
    if(hbscontent.isLogin) {
        next();
    }
    else {
        res.redirect('/login');
    }
}