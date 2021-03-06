var express = require('express');
var exphbs = require('express-handlebars');
var morgan = require('morgan');
var app = express();
var hbs_sections = require('express-handlebars-sections');

const publicPath = './assets';

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded());

var hbscontent = {
    isLogin: false,
    username: '',
    currentIDUser: 0,
    currentPage: '/',
    title: '',
    isAdmin: false,
    cart: [],
    paymentsuccess: false
}

app.engine('hbs', exphbs({
    extname: 'hbs',
    defaultLayout: 'main.hbs',
    layoutsDir: 'views/layouts',
    partialsDir: 'views/partials',
    helpers: { section: hbs_sections() }
}));

app.set('view engine', 'hbs');
require('./middlewares/upload')(app);

app.use('/', express.static(publicPath));

//Routing
app.use('/', require('./routes/index'));
app.use('/tag',require('./routes/tag.route'));
app.use('/login', require('./routes/login.route'));
app.use('/signup', require('./routes/signup.route'));
app.use('/category', require('./routes/category.route'));
app.use('/product', require('./routes/product.route'));
app.use('/admin', require('./routes/admin/admin.route'));
app.use('/cart', require('./routes/cart.route'));
app.use('/search',require('./routes/search.route'));

app.listen(3000, () => {
    console.log("Web Server running on Port 3000");
});

module.exports = hbscontent;