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

app.get('/', (req,res) => {
   res.render('index');
});

app.get('/singleproduct', (req,res) => {
    res.render('singleproduct');
 });

app.get('/login', (req,res) => {
    res.render('login', {layout: false});
 });

app.listen(3000, () => {
    console.log("Web Server running on Port 3000");
});