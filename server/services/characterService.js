var database = require('../database.js'),
	sql = require('../sql.json').characters;

module.exports.list = function(userId, callback) {
	if ( typeof callback !== "function" ) {
		throw new Error('characterService.list(): invalid callback');
	}
	if ( userId ) {
		connection.query(sql.selectForUser, [userId], callback);
	} else { 
		connection.query(sql.selectAll, callback);
	}
}

module.exports.getData = function(characterId, userId, callback) {
	if ( typeof callback !== "function" ) {
		throw new Error('characterService.getData(): invalid callback');
	}

	database.query(sql.selectData, [characterId, userId], function(err, result) {
		if (err) {
			return callback(err);
		}
		if ( result.length === 0 ) {
			return callback(null, null);
		}
		var characterData = result[0].character_data,
			characterStatus = result[0].character_status;
		callback(null, {
			data: characterData ? JSON.parse(characterData) : null,
			status: characterStatus ? JSON.parse(characterStatus) : null,
		});
	});
}

module.exports.insert = function(userId, ruleSystemId, data, status, callback) {
	if ( typeof callback !== "function" ) {
		throw new Error('characterService.insert(): invalid callback');
	}
	var name = data.name;
	database.query(sql.insert, [userId, name, ruleSystemId, JSON.stringify(data), JSON.stringify(status)], function(err, result) {
		if (err) {
			return callback(err);
		}
		callback(null, {id: result.insertId});
	});
}

module.exports.updateData = function(characterId, userId, data, status, callback) {
	if ( typeof callback !== "function" ) {
		throw new Error('characterService.updateData(): invalid callback');
	}

	database.query(sql.updateData, [JSON.stringify(data), JSON.stringify(status), characterId, userId], callback);
}

module.exports.updateStatus = function(characterId, userId, status, callback) {
	if ( typeof callback !== "function" ) {
		throw new Error('characterService.updateStatus(): invalid callback');
	}
	
	database.query(sql.updateStatus, [JSON.stringify(status), characterId, userId], callback);
}

module.exports.delete = function(characterId, userId, callback) {
	if ( typeof callback !== "function" ) {
		throw new Error('characterService.delete(): invalid callback');
	}
	
	database.query(sql.delete, [characterId, userId], callback);
}