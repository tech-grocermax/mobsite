define(['app'], function(app) {
	app.controller('pageController',  [
        '$scope', '$rootScope', '$routeParams', '$location',  
        function($scope, $rootScope, $routeParams, $location) {                        
        	$scope.showSearchBar = false;
        	$scope.columnSize = 1;
        	$scope.pageName = $routeParams.pageName;
        	$scope.showSearchIcon = true;
        	$scope.showMoreIcon = false;
        	$scope.pageRoute = {
        		"faq": false,
        		"contact": false,
        		"payment": false,
        		"term": false,
        		"about": false
        	};
        	$scope.pageRoute[$scope.pageName] = true;
            $scope.showMoreMenuOptions = false;
            $scope.showUserMenuOptions = false;

            $scope.showMoreMenu = function() {
                $scope.showUserMenuOptions = false;
                $scope.showMoreMenuOptions = $scope.showMoreMenuOptions ? false : true;
            };

            $scope.showUserMenu = function() {
                $scope.showMoreMenuOptions = false;
                $scope.showUserMenuOptions = $scope.showUserMenuOptions ? false : true;
            };

        }
    ]);
});