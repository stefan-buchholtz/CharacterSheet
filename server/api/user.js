'use strict';

var router = require('express').Router(),
	jsonWebToken = require('jsonwebtoken'),
	userService = require('../services/userService.js'),
	config = require('../config.js');
	
function sendAuthSuccess(user, rememberMe, res) {
	var options = rememberMe ? {} : { expiresInMinutes: 60 * 24 };
	var token = jsonWebToken.sign({userId: user.id, rememberMe: rememberMe}, config.authentication.secret, options);
	res.json({
		token: token,
		user: user,
		rememberMe: rememberMe
	});	
}

router.post('/user/authenticate', function(req, res) {
	userService.checkLogin(req.body.email, req.body.password, function(err, user) {
		if ( err ) {
			return res.json(500, err);
		}
		if ( user ) {
			sendAuthSuccess(user, req.body.rememberMe, res);
		} else {
			res.send(401, 'Wrong email or password');
		}
	});
});

router.post('/private/user/reauthenticate', function(req, res) {
	userService.get(req.user.userId, function(err, user) {
		if ( err ) {
			return res.json(500, err);
		}
		if ( user ) {
			sendAuthSuccess(user, req.user.rememberMe, res);
		} else {
			res.send(401, 'unknown user');
		}
	});
});

module.exports = router;