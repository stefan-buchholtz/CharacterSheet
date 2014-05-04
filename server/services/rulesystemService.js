var database = require('../database.js'),
	sql = require('../sql.json');

module.exports.list = function(callback) {
	database.query(sql.ruleSystems.selectAll, callback);
}
