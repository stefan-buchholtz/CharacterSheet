var database = require('../database.js'),
	sql = require('../database/sql.json');

module.exports.list = function(callback) {
	database.query(sql.ruleSystems.selectAll, callback);
}
