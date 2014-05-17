(function(angular) {
	'use strict';

	var characterSheetServices = angular.module('characterSheetServices', ['ngResource']);

	characterSheetServices.factory('Character', ['$resource', function($resource) {
		return $resource('api/private/characters/:characterId', {}, {});
	}]);
	
	characterSheetServices.factory('PublicCharacter', ['$resource', function($resource) {
		return $resource('api/public/characters/:characterId', {}, {});
	}]);
})(angular);

