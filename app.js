var express = require('express');
var exphbs = require('express-handlebars');
var app = express();
const publicPath = './assets';

//app.use(morgan('dev'));
//app.use(express.json());
//app.use(express.urlencode());

app.engine('hbs', exphbs({
    extname: 'hbs',
    defaultLayout: 'main.hbs',
    layoutsDir: 'views/layouts',
    partialsDir: 'views/partials'
}));

app.set('view engine', 'hbs');

app.use('/', express.static(publicPath));

app.use('/categorylist', (req, res) => {
    res.render('categorylist');
})

app.get('/', (req,res) => {
   res.render('index');
});

app.get('/singleproduct', (req,res) => {
    res.render('singleproduct');
 });

app.get('/login', (req,res) => {
    res.render('login', {layout: false});
 });

app.get('/signup', (req, res) => {
    res.render('signup', {layout: false});
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/cart', (req, res) => {
    res.render('cart');
});

app.use('/admin', require('./routes/admin/admin.route'));

app.listen(3000, () => {
    console.log("Web Server running on Port 3000");
});