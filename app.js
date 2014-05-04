var express = require('express'),
	path = require('path'),
	favicon = require('serve-favicon'),
	logger = require('morgan'),
	bodyParser = require('body-parser'),
	conf = require('node-conf'),
	characterApi = require('./api/characters.js')

var app = express();
//app.set('view engine', 'jade');

app.use(favicon(__dirname + '/app/images/favicon.ico'));
app.use(express.static(path.join(__dirname, 'app')));
app.use(logger('dev'));
app.use(bodyParser.json({strict: true}));
app.use('/api', characterApi);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.json(err.status || 500, {
			message: err.message,
			stack: err.stack
		});
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.json(err.status || 500, {
		message: err.message
	});
});


module.exports = app;
