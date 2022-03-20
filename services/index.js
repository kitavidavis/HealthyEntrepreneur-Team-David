var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var Handlebars = require('handlebars');
var expressHandlebars = require('express3-handlebars');
var expressValidator = require('express-validator');
var connectFlash = require('connect-flash');
var expressSession = require('express-session');
var passport = require('passport');
var mongoose = require('mongoose');

const uri = 'mongodb+srv://Daviskitavi:35330872@mernproject.50ink.mongodb.net/flux?retryWrites=true&w=majority';

mongoose.connect(uri);

var app = express();

const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

//View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', expressHandlebars({defaultLayout:'index', handlebars: allowInsecurePrototypeAccess(Handlebars)}));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(cookieParser());

var expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
app.use(cookieSession({
    name: 'login-session',
    keys: ['jhjkfddjuyituismekot', 'uhjurtuippm4n2n'],
    maxAge: expiryDate
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(expressSession({
    secret: 'jkcjgfruj4jklkf9nb6',
    saveUninitialized: true,
    resave: true,
    cookie: {maxAge: 24 * 60 * 60 }
}));

app.use(passport.initialize());
app.use(passport.session());

//Express validator
app.use(expressValidator({
	errorFormatter: function (param, msg, value) {
		var namespace = param.split('.')
			, root = namespace.shift()
			, formParam = root;
		while(namespace.length){
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param: formParam,
			msg: msg,
			value: value
		};
	}
}));

app.use(connectFlash());

app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    res.locals.host = 'http://localhost:'+app.get('port');
    next();
});

app.use('/customers', require('./routes/customers'));
app.use('/users', require('./routes/users'));
app.use('./inventory', require('./routes/inventory'));

app.get('/', function(req, res){
    res.render('index')
});

app.use(function(err, req, res, next){
    console.log(err.stack);
    res.status(500);
    res.render('500');
});

app.use(function(req, res){
    res.status(404);
    res.render('404');
});

app.set('port', process.env.PORT || 3000);
mongoose.connection.on("error", function(err){
    console.log("Mongodb is not running. "+ err);
    process.exit();
}).on('connected', function(){
    app.listen(app.get('port'), function(){
        console.log('App running at http://localhost:'+ app.get('port'));
    });
});