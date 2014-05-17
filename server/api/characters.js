'use strict';

var router = require('express').Router(),
	characterService = require('../services/characterService.js');

function getCharacter(req, res, next) {
	var userId = req.user ? req.user.userId : null;
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
}

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

router.get('/public/characters', function(req, res) {
	characterService.listPublic(function(err, characters) {
		if ( err ) {
			return res.json(500, err);
		}
		res.json(200, characters);
	});	
});

router.get('/public/characters/:characterId', getCharacter);

router.get('/private/characters', function(req, res) {
	characterService.list(req.user.userId, function(err, characters) {
		if ( err ) {
			return res.json(500, err);
		}
		res.json(200, characters);
	});
});

router.route('/private/characters/:characterId')
	.get(getCharacter)
	.post(function(req, res, next) {
		var err;
		if ( !req.body ) {
			err = new Error('expected JSON content');
			err.status = 400;
			return next(err);
		}
		console.log('POST /private/characters/' + req.params.characterId, 'body: ', req.body);
		if ( typeof req.body.is_public === 'boolean' ) {
			characterService.updateIsPublic(req.params.characterId, req.user.userId, req.body.is_public, makeUpdateDeleteCallback(res, next));
		} else {
			var data = req.body.data,
				status = req.body.status || null;
			if ( !data && !status ) {
				err = new Error('invalid content');
				err.status = 400;
				return next(err);
			}

			if ( data ) {
				characterService.updateData(req.params.characterId, req.user.userId, data, status, makeUpdateDeleteCallback(res, next));
			} else {
				characterService.updateStatus(req.params.characterId, req.user.userId, status, makeUpdateDeleteCallback(res, next));
			}
		}
	})
	.delete(function(req, res, next) {
		characterService.delete(req.params.characterId, req.user.userId, makeUpdateDeleteCallback(res, next));
	});

module.exports = router;
