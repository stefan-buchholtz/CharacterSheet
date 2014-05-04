(function(angular) {
	'use strict';
	
	var characterList = angular.module('characterList', ['characterSheetServices']);
	
	characterList.controller('CharacterListCtrl', ['$scope', 'Character', function($scope, Character) {
		$scope.characters = Character.list();
	}]);
	
})(angular);
