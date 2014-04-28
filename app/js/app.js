'use strict';

var characterSheetApp = angular.module('characterSheetApp', [
	'ngRoute',
	'characterSheetControllers',
	'characterSheetServices'
]);

characterSheetApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/character', {
				templateUrl: 'partials/sr4/base.html',
				controller: 'Sr4CharacterSheetCtrl'
			}).
			otherwise({
				redirectTo: '/character'
			});
	}]);