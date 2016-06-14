const KEY = 'ntalk.sid',
	SECRET = 'ntalk';

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
var cookie = cookieParser(SECRET);
var store = new session.MemoryStore();

var mongoose = require('mongoose');

global.db = mongoose.connection;
global.db.on('error', function (err) { console.log(err.message); });
global.db.once('open', function () {
    console.log("mongodb connection open");
});

mongoose.connect('mongodb://localhost:27017/ntalk');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookieParser('ntalk'));
app.use(session({
	secret: SECRET,
	name: KEY,
	resave: true,
	saveUninitialized: true,
	store: store
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(methodOverride('_method'));
app.use(router);
app.use(express.static(__dirname + '/public'));

io.use(function(socket, next) {
	var data = socket.request;
	cookie(data, {}, function(err) {
		var sessionID = data.signedCookies[KEY];
		store.get(sessionID, function(err, session) {
			if (err || !session) {
				return next(new Error('acesso negado'));
			} else {
				socket.handshake.session = session;
				return next();
			}
		});
	});
});

load('models').then('controllers').then('routes').into(app);

load('sockets').into(io);

server.listen(3000, function() {
	console.log("Ntalk no ar.");
});


app.use(error.notFound);
app.use(error.serverError);