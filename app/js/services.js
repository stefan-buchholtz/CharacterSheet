'use strict';

var characterSheetServices = angular.module('characterSheetServices', ['ngResource']);

characterSheetServices.factory('Character', ['$resource', function($resource) {
	return $resource('api/characters/:characterId', {}, {
		list: { method: 'GET', params: { characterId: '' }, isArray: true },
		get: { method: 'GET', params: { characterId: 1 }, isArray: false }
	});

}]);
