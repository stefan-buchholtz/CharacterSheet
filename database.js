var mysql = require('mysql2'),
	config = require('./config.js');
	
var pool = mysql.createPool(config.database);

module.exports.pool = pool;

module.exports.getConnection = pool.getConnection;

module.exports.query = function(sql, params, callback) {
	if ( typeof params === "function" ) {
		callback = params;
		params = undefined;
	}
	pool.getConnection(function(err, connection) {
		if ( err ) {
			return callback(err);
		}
		connection.query(sql, params, function(err, result) {
			connection.release();
			callback(err, result);
		});
	});
}