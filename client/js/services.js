(function(angular) {
	'use strict';

	var characterSheetServices = angular.module('characterSheetServices', ['ngResource']);

	characterSheetServices.factory('Character', ['$resource', function($resource) {
		return $resource('api/characters/:characterId', {}, {
		});
		/*
			list: { method: 'GET', params: { characterId: '' }, isArray: true },
			get: { method: 'GET', params: { }, isArray: false },
			updateStatus: { method: 'PUT', params: {}, isArray: false },
			delete: { method: 'DELETE', params: {}, isArray: false },
		*/

	}]);	
})(angular);

