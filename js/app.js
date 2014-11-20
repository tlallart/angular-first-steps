(function () {
	
	var app = angular.module('logmodule', []);

	app.directive('menuTabs', function () {
		return {
			restrict: 'E',
			templateUrl: 'tabs.html',
			controller: function () {
				this.tab=1;
				this.setTab = function (tab_to_activate) {
					this.tab = tab_to_activate;
				};
				this.isSet = function (tab_to_check) {
					return this.tab === tab_to_check;
				};
			},
			controllerAs: 'tab'
		};
	});

	app.factory('data', function() {
		return [];
	});

	app.directive('logTab', ['$http', function($http) {
		return {
			restrict: 'E',
			templateUrl: 'tab_log.html',
			controller: function ($scope, data) {
				this.loadLogs = function() {
					this.logs = [];
					var obj = this;
					$http.get('http://localhost:3000?display').success(function (info) {
						obj.logs = info;
					});
					$scope.data = obj;
				};
			},
			controllerAs: 'logCtrl'
		};
	}]);
	
	app.directive('addTab', ['$http', '$log', function($http, $log) {
		return {
			restrict: 'E',
			templateUrl: 'tab_add.html',
			controller: function ($scope, data) {
				this.saveLog = function() {
					var obj = this;
					$log.warn('Request server...');
					$http.get('http://localhost:3000?add&username=' + this.username + '&msg=' + this.msg).success(function (info) {
						$scope.data.logs.push({timestamp:info.time, username:obj.username, msg:obj.msg});
						obj=msg;
					});
					$log.warn('Request done');
				};
			},
			controllerAs: 'formCtrl'
		};
	}]);
})();
