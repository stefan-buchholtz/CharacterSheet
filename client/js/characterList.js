(function(angular) {
	'use strict';
	
	var characterList = angular.module('characterList', ['characterSheetServices']);
	
	characterList.controller('CharacterListCtrl', ['$scope', 'Character', function($scope, Character) {
		$scope.onIsPublicChange = function(character) {
			Character.save({characterId: character.id}, {is_public: character.is_public});
		};
		$scope.characters = Character.query();
	}]);
	
})(angular);
