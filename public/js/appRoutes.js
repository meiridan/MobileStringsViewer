angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider


		.when('/android', {
			templateUrl: 'views/StringsView.html',
			controller: 'StringsController'
		})

		.when('/ios', {
			templateUrl: 'views/StringsView.html',
			controller: 'StringsController'
		})
		.otherwise({
	   	redirectTo: '/ios'
	         });

	$locationProvider.html5Mode(true);

}]);
