(function(angular) {
	'use strict';
	
	var security = angular.module('security', []);
	
	security.controller('StartPageCtrl', ['$location', 'LoginService', function($location, loginService) {
		loginService.checkLogin().then(function(loginStatus) {
			if ( loginStatus.isLoggedIn ) {
				$location.path('/list/private').replace();
			} else {
				$location.path('/list/public').replace();
			}
		}, function() {
			$location.path('/list/public').replace();
		});
	}]);
	
	security.controller('LoginCtrl', ['$scope', '$location', 'LoginService', function($scope, $location, loginService) {
		$scope.submit = function(loginData) {
			loginData.rememberMe = loginData.rememberMe || false;
			loginService.login(loginData).then(function(loginStatus) {
				if ( loginStatus.isLoggedIn ) {
					$scope.statusText = '';
					$scope.$close('success');
					if ( $location.path() === '/list/public' ) {
						$location.path('/list/private');
					}
				} else {
					$scope.statusText = 'Falsche E-Mail oder Passwort';
				}
			}, function(/* error */) {
				
			});
		};
		$scope.cancel = function() {
			$scope.statusText = '';
			$scope.$dismiss('canceled');
		};
	}]);
	
	security.factory('LoginService', ['$window', '$http', '$q', '$location', function($window, $http, $q, $location) {
		var my = {};
		
		my.loginStatus = {
			isLoggedIn: false,
			user: null
		};
		
		function setLoggedIn(user, token, rememberMe) {
			my.loginStatus.isLoggedIn = true;
			my.loginStatus.user = user;
			$window.sessionStorage.userToken = token;
			if ( rememberMe ) {
				$window.localStorage.userToken = token;
			} else {
				delete $window.localStorage.userToken;
			}
		}
		
		function setLoggedOut() {
			my.loginStatus.isLoggedIn = false;
			my.loginStatus.user = null;
			delete $window.sessionStorage.userToken;
			delete $window.localStorage.userToken;
			$location.path('/list/public');
		}
		
		function authenticate(authRequest) {
			var authResult = $q.defer();
			authRequest.success(function(result) {
				setLoggedIn(result.user, result.token, result.rememberMe);
				authResult.resolve(my.loginStatus);
			}).error(function(data, status) {
				setLoggedOut();
				if ( status === 401 ) {
					authResult.resolve(my.loginStatus);
				} else {
					authResult.reject({error: data, status: status});
				}
			});
			return authResult.promise;
		}
		
		my.login = function(loginData) {
			return authenticate($http.post('api/user/authenticate', loginData));
		};
		
		my.logout = function() {
			setLoggedOut();
			return this.loginStatus;
		};
		
		my.checkLogin = function() {
			var deferred = $q.defer();
			var promise = deferred.promise;
			if ( this.loginStatus.isLoggedIn ) {
				deferred.resolve(this.loginStatus);
				return promise;
			}
			
			if ( $window.localStorage.userToken && !$window.sessionStorage.userToken ) {
				$window.sessionStorage.userToken = $window.localStorage.userToken;
			}
			if ( !$window.sessionStorage.userToken ) {
				deferred.resolve(this.loginStatus);
				return promise;
			}
			return authenticate($http.post('api/private/user/reauthenticate', {}));
		};
		
		return my;
	}]);
	
	security.factory('authInterceptor', ['$window', function($window) {
		return {
			request: function(config) {
				if ( config.url.indexOf('api/private') === 0 && $window.sessionStorage.userToken ) {
					config.headers = config.headers || {};
					config.headers.Authorization = 'Bearer ' + $window.sessionStorage.userToken;
				}
				return config;
			}
		};
	}]);
	
	security.config(['$httpProvider', function($httpProvider) {
		$httpProvider.interceptors.push('authInterceptor');
	}]);
	
})(angular);