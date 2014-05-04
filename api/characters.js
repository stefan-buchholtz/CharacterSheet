var router = require('express').Router(),
	characterService = require('../services/characterService.js');

var userId = 1;

router.get('/characters', function(req, res) {
	characterService.list(userId, function(err, characters) {
		if ( err ) {
			return res.json(500, err);
		}
		res.json(200, characters);
	});
});

router.route('/characters/:characterId')
	.get(function(req, res, next) {
		console.log('request character id', req.params.characterId)
		characterService.getData(req.params.characterId, userId, function(err, character) {
			if (err) {
				return next(err);
			}
			if (!character) {
				err = new Error('character not found');
				err.status = 404;
				return next(err);
			}
			res.json(200, character);	
		});
	})
	.put(function(req, res, next) {
		var err;
		if ( req.body ) {
			err = new Error('expected JSON content');
			err.status = 400;
			return next(err);
		}
		var data = req.body.data,
			status = req.body.status || null;
		if ( !data && !status ) {
			err = new Error('invalid content');
			err.status = 400;
			return next(err);
		}
		
		var cb = function(err, result) {
			if (err) {
				return next(err);
			}
			if ( !result.affectedRows ) {
				err = new Error('character not found');
				err.status = 404;
				return next(err);
			}
			res.json(200, { message: 'success'});
		}
		if ( data ) {
			characterService.updateData(req.params.characterId, userId, data, status, cb)
		} else {
			characterService.updateStatus(req.params.characterId, userId, status, cb)
		}
	})
	.delete(function(req, res, next) {
		
	});

module.exports = router;
