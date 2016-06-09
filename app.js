var express = require('express');
var load = require('express-load');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var error = require('./middleware/error');

var app = express();
var router = express.Router();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(session({
	secret: 'ssshhhhh',
	saveUninitialized: true,
	resave: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(methodOverride());
app.use(router);
app.use(express.static(__dirname + '/public'));


load('models').then('controllers').then('routes').into(app);
app.listen(3000, function() {
	console.log("Ntalk no ar.");
});

app.use(error.notFound);
app.use(error.serverError);

