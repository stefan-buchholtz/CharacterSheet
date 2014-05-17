(function(angular) {
	'use strict';
	
	var characterList = angular.module('characterList', ['characterSheetServices', 'navigation']);
	
	characterList.controller('CharacterListCtrl', ['$scope', '$routeParams', 'Character', 'PublicCharacter', 
		function($scope, $routeParams, Character, PublicCharacter) {
			$scope.status = $routeParams.status;
			$scope.isPublic = $routeParams.status === 'public';
			if ( !$scope.isPublic ) {
				$scope.onIsPublicChange = function(character) {
					Character.save({characterId: character.id}, {is_public: character.is_public});
				};
				$scope.characters = Character.query();
			} else {
				$scope.characters = PublicCharacter.query();
			}
		}
	]);
	
})(angular);
