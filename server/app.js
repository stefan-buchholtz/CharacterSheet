'use strict';

var express = require('express'),
	path = require('path'),
	favicon = require('serve-favicon'),
	logger = require('morgan'),
	bodyParser = require('body-parser'),
	expressJwt = require('express-jwt'),
	characterApi = require('./api/characters.js'),
	userApi = require('./api/user.js'),
	config = require('./config.js');

var app = express();

app.use(favicon(path.join(__dirname, '../client/images/favicon.ico')));
app.use(express.static(path.join(__dirname, '../client')));
app.use(logger('dev'));
app.use(bodyParser.json({strict: true}));

app.use('/api/private', expressJwt({secret: config.authentication.secret}));

app.use('/api', characterApi);
app.use('/api', userApi);

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
    app.use(function(err, req, res) {
        res.json(err.status || 500, {
			message: err.message,
			stack: err.stack
		});
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
    res.json(err.status || 500, {
		message: err.message
	});
});


module.exports = app;
