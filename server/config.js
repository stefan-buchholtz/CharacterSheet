'use strict';

var conf = require('node-conf'),
	environment = process.env.NODE_ENV || 'development';
	
module.exports = conf.load(environment);
