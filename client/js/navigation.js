(function(angular) {
	'use strict';
	
	var navigation = angular.module('navigation', ['ui.bootstrap.modal', 'security']);
	
	navigation.directive('csTopnav', ['$modal', 'LoginService', function($modal, loginService) {
		return {
			restrict: 'E',
			scope: {
			},
			templateUrl: 'partials/topnav.html',
			link: function($scope) {
				loginService.checkLogin();
				$scope.loginStatus = loginService.loginStatus;
				
				$scope.login = function() {
					$modal.open({
						templateUrl: 'partials/login.html',
						size: 'sm',
						controller: 'LoginCtrl'
					});
				};
				$scope.logout = function() {
					loginService.logout();
				};
			}
		};
	}]);
})(angular);