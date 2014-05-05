'use strict';

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

var makeUpdateDeleteCallback = function(res, next) {
	return function(err, result) {
		if (err) {
			return next(err);
		}
		if ( !result.affectedRows ) {
			err = new Error('character not found');
			err.status = 404;
			return next(err);
		}
		res.json(200, { message: 'success'});
	};
};

router.route('/characters/:characterId')
	.get(function(req, res, next) {
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
	.post(function(req, res, next) {
		var err;
		if ( !req.body ) {
			err = new Error('expected JSON content');
			err.status = 400;
			return next(err);
		}
		console.log('POST /characters/' + req.params.characterId, 'body: ', req.body);
		if ( typeof req.body.is_public === 'boolean' ) {
			characterService.updateIsPublic(req.params.characterId, userId, req.body.is_public, makeUpdateDeleteCallback(res, next));
		} else {
			var data = req.body.data,
				status = req.body.status || null;
			if ( !data && !status ) {
				err = new Error('invalid content');
				err.status = 400;
				return next(err);
			}

			if ( data ) {
				characterService.updateData(req.params.characterId, userId, data, status, makeUpdateDeleteCallback(res, next));
			} else {
				characterService.updateStatus(req.params.characterId, userId, status, makeUpdateDeleteCallback(res, next));
			}
		}
	})
	.delete(function(req, res, next) {
		characterService.delete(req.params.characterId, userId, makeUpdateDeleteCallback(res, next));
	});

module.exports = router;
