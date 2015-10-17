define(['app'], function(app) {
	app.controller('pageController',  [
        '$scope', '$rootScope', '$routeParams', '$location', '$timeout', 
        function($scope, $rootScope, $routeParams, $location, $timeout) {                        
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
            $scope.isUserLoggedIn = angular.isDefined(utility.getJStorageKey("userId")) && utility.getJStorageKey("userId") ? true : false;
            $scope.cityList = null;
            $scope.cityLocation = {};
            
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

            openCitySelectionModal = function() {
                $timeout(function(){
                    $('#myModal').modal({
                        backdrop: false,
                        keyboard: false,
                        show: true
                    });
                }, 1000);
            };

            getCityList = function() {
                utility.getCityList()
                    .then(function(data){
                        $scope.cityList = data.location;
                        angular.forEach($scope.cityList, function(value, key) {
                            var city = value.city_name.toLowerCase();
                            $scope.cityLocation[city] = false;
                        });
                        console.log($scope.cityLocation);
                        openCitySelectionModal();
                    });
            };

            hideCitySelectionModal = function() {
                $('#myModal').modal('hide');
            };

            $scope.setCityLocation = function(location) {
                var city = location.city_name.toLowerCase(),
                    cityId = location.id;

                angular.forEach($scope.cityLocation, function(value, key){
                    $scope.cityLocation[key] = false;
                });
                $scope.cityLocation[city] = true;
                utility.setJStorageKey("selectedCity", city, 1);
                utility.setJStorageKey("selectedCityId", location.id, 1);
                hideCitySelectionModal();
            };

            angular.element(document).ready(function () {
                if(angular.isUndefined(utility.getJStorageKey("selectedCity"))
                    || !utility.getJStorageKey("selectedCity")) {
                    getcityList();
                }                  
            });
        }
    ]);
});