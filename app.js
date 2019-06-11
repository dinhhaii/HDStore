var express = require('express');
var exphbs = require('express-handlebars');
var morgan = require('morgan');
var app = express();
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
    isAdmin: false
}

app.engine('hbs', exphbs({
    extname: 'hbs',
    defaultLayout: 'main.hbs',
    layoutsDir: 'views/layouts',
    partialsDir: 'views/partials'
}));

app.set('view engine', 'hbs');

app.use('/', express.static(publicPath));

//Routing
app.use('/', require('./routes/index'));

app.use('/login', require('./routes/login.route'));

app.use('/admin', require('./routes/admin/admin.route'));

app.listen(3000, () => {
    console.log("Web Server running on Port 3000");
});

module.exports = hbscontent;