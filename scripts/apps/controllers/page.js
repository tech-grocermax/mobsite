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
            $scope.cityLocation = {
                "delhi": false,
                "gurgaon": false,
                "noida": false
            };

            openCitySelectionModal = function() {
                $timeout(function(){
                    $('#myModal').modal({
                        backdrop: false,
                        keyboard: false,
                        show: true
                    });
                }, 1000);
            };

            hideCitySelectionModal = function() {
                $('#myModal').modal('hide');
            };

            angular.element(document).ready(function () {
                if(angular.isUndefined(utility.getJStorageKey("selectedCity"))
                    || !utility.getJStorageKey("selectedCity")) {
                    openCitySelectionModal();
                }                  
            });     

            $scope.setCityLocation = function(city) {
                angular.forEach($scope.cityLocation, function(value, key){
                    $scope.cityLocation[key] = false;
                });
                $scope.cityLocation[city] = true;
                utility.setJStorageKey("selectedCity", city, 1);
                hideCitySelectionModal();
            };

            $scope.showMoreMenu = function() {
                $scope.showUserMenuOptions = false;
                $scope.showMoreMenuOptions = $scope.showMoreMenuOptions ? false : true;
            };

            $scope.showUserMenu = function() {
                $scope.showMoreMenuOptions = false;
                $scope.showUserMenuOptions = $scope.showUserMenuOptions ? false : true;
            };

            $scope.handleOutSideClick = function() {
                $scope.showUserMenuOptions = false;
                $scope.showMoreMenuOptions = false;
                //$scope.showCategoryMenu = false;
                //$scope.showSubCategoryMenu = false;
            };

        }
    ]);
});