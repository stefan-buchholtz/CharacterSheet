'use strict';

var database = require('../database.js'),
	sql = require('../sql.json').users,
	bcrypt = require('bcrypt'),
	cost = 12,
	loginFailDelay = 3000;

module.exports.listAll = function(callback) {
	if ( typeof callback !== 'function' ) {
		throw new Error('userService.listAll(): invalid callback');
	}
	
	database.query(sql.selectAll, callback);
};

module.exports.get = function(userId, callback) {
	if ( typeof callback !== 'function' ) {
		throw new Error('userService.get(): invalid callback');
	}
	
	database.query(sql.select, [userId], function(err, result) {
		if ( err ) {
			return callback(err);
		}
		callback(null, result.length === 1 ? result[0] : null);
	});
};

module.exports.checkLogin = function(email, password, callback) {
	if ( typeof callback !== 'function' ) {
		throw new Error('userService.checkLogin(): invalid callback');
	}
	
	database.query(sql.selectByEmail, [email], function(err, result) {
		if ( err ) {
			return callback(err);
		}
		if ( result.length !== 1 ) {
			// User not found
			setTimeout(callback, loginFailDelay, null, null);
			return;
		}
		var user = result[0];
		bcrypt.compare(password, user.password, function(err, compareResult) {
			if ( err ) {
				setTimeout(callback, loginFailDelay, err);
				return;
			}
			delete user.password;
			if ( compareResult ) {
				callback(null, user);
			} else {
				setTimeout(callback, loginFailDelay, null, null);
			}
		});
	});
};

module.exports.changePassword = function(userId, password, callback) {
	if ( typeof callback !== 'function' ) {
		throw new Error('userService.checkLogin(): invalid callback');
	}
	
	bcrypt.genSalt(cost, function(err, salt) {
		if ( err ) {
			return callback(err);
		}
		bcrypt.hash(password, salt, function(err, passwordHash) {
			database.query(sql.updatePassword, [passwordHash, userId], callback);
		});
	});
};
