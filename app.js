var express = require('express');
var load = require('express-load');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var error = require('./middleware/error');
var router = express.Router();
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookieParser('ntalk'));
app.use(session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(methodOverride('_method'));
app.use(router);
app.use(express.static(__dirname + '/public'));


load('models').then('controllers').then('routes').into(app);

load('sockets').into(io);

server.listen(3000, function() {
	console.log("Ntalk no ar.");
});


app.use(error.notFound);
app.use(error.serverError);