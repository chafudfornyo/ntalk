var express = require('express');
var load = require('express-load');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var error = require('./middleware/error');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

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
io.sockets.on('connection', function(client) {

	client.on('send-server', function(data) {

		var msg = "<b>" + data.nome + ":</b> " + data.msg + "<br>";

		client.emit('send-client', msg);

		client.broadcast.emit('send-client', msg);

	});

});

app.listen(3000, function() {
	console.log("Ntalk no ar.");
});


app.use(error.notFound);
app.use(error.serverError);