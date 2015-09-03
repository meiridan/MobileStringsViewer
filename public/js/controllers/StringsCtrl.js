angular.module('StringsCtrl', []).controller('StringsController', function($scope, $http , $location)  {

	$scope.stillLoading = true;
	$scope.tabPath =  $location.path()  ;

 	$http.get("/api/strings" +  $location.path()).then(function(response) {
		$scope.strs =	response.data ;
		$scope.stillLoading = false;
		}, function(response) {
		//	$scope.strs =	response ;
	});

	$scope.isStillLoading = function () {
		return $scope.stillLoading ;
	};
});
