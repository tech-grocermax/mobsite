define(['app'], function(app) {
	app.controller('categoryController',  [
        '$scope', '$rootScope', '$location', '$timeout', '$routeParams', 'categoryService', 'utility', 
        function($scope, $rootScope, $location, $timeout, $routeParams, categoryService, utility){
        	$scope.categories = null;
            $scope.categoryIndex = -1;
            $scope.subCategoryIndex = -1;
            $scope.categoryName = null;
            $scope.subCategoryList = null;
            $scope.showCategoryMenu = false;
            $scope.showSubCategoryMenu = false;
            $scope.subSubCategoryIndex = -1;
            $scope.preserveCategoryId = null;
            $scope.showMoreMenuOptions = false;
            $scope.showSearchBar = true;
            $scope.showSearchIcon = false;
            $scope.showMoreIcon = true;
            $scope.showMoreMenuOptions = false;
            $scope.showUserMenuOptions = false;
            $scope.cityLocation = {
                "delhi": false,
                "gurgaon": false,
                "noida": false
            };
            $scope.searchKeyword = "";
            $scope.moreCategoryIndex = -1;
            $scope.preserveMoreCategoryId = null;

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

            if (utility.getJStorageKey("categories")) {
                $scope.categories = utility.getJStorageKey("categories");
            } else {
        	    categoryService.getCategoryList()
                    .then(function(data){
                        $scope.categories = data.Category.children[0].children; 
                        utility.setJStorageKey("categories", $scope.categories, 1);
                    });
            }

            if (utility.getJStorageKey("offerCategories")) {
                $scope.offerCategories = utility.getJStorageKey("offerCategories");
            } else {
                categoryService.getCategoryOfferList()
                    .then(function(data){
                        $scope.offerCategories = data.category; 
                        utility.setJStorageKey("offerCategories", $scope.offerCategories, 1);
                    });
            }

            if (utility.getJStorageKey("deals")) {
                $scope.deals = utility.getJStorageKey("deals");
            } else {
                categoryService.getDealList()
                    .then(function(data){
                        $scope.deals = data.deal_type; 
                        utility.setJStorageKey("deals", $scope.deals, 1);
                    });
            }

            $scope.dealCategoryList = [];
            $scope.dealCategoryItemList = {};
            $scope.dealItems = null;
            $scope.activeDealCategory = "all";

            getDealItemList = function(data) {
                $scope.dealCategoryList = [];
                $scope.dealCategoryList.push({id: "all", label: "All"});
                $scope.dealCategoryItemList["all"] = data["all"];
                $scope.dealItems = data["all"];
                angular.forEach(data.category, function(value, key) {
                    if(value.is_active == "1") {
                        $scope.dealCategoryList.push({
                            id: value.category_id, 
                            label: value.name
                        });
                        $scope.dealCategoryItemList[value.category_id] = value.deals;
                    }                                        
                });
            }

            getDealItemListByOffer = function(data) {
                $scope.dealCategoryList = [];
                $scope.dealCategoryList.push({id: "all", label: "All"});
                $scope.dealCategoryItemList["all"] = data["all"];
                $scope.dealItems = data["all"];
                $scope.activeDealCategory = $routeParams.dealCategoryId;
                angular.forEach(data.dealsCategory, function(value, key) {
                    $scope.dealCategoryList.push({
                        id: key, 
                        label: value.dealType
                    });
                    $scope.dealCategoryItemList[key] = value.deals;                                                           
                });
            };

            if ($routeParams.categoryId) {
                $scope.subCategoryList = categoryService.getSubCategoryList($scope.categories, $routeParams.categoryId);
                $scope.categoryName = categoryService.getCategoryName($scope.categories, $routeParams.categoryId);
                $scope.columnSize = 4;
            } else if ($routeParams.dealId) {
                categoryService.getDealsByDealId($routeParams.dealId)
                    .then(function(data){  
                        if(data.flag == 1) {                      
                            getDealItemList(data.dealcategory);
                        }
                    });
            }  else if ($routeParams.dealCategoryId) {
                categoryService.getDealsByDealCategoryId($routeParams.dealCategoryId)
                    .then(function(data){      
                        if(data.flag == 1) {
                            getDealItemListByOffer(data.dealcategorylisting);
                        }                                  
                    });
            } else{
                $scope.columnSize = 1;
            }

            $scope.getDealCategoryItemList = function(category) {
                $scope.activeDealCategory = category.id;
                $scope.dealItems = $scope.dealCategoryItemList[category.id];
            };

            $scope.routerChange = function(route, id) {
                route = angular.isDefined(id) ? route + ("/" + id) : route;
                $location.url(route);
            };
            
            $scope.toggleCategoryMenu = function() {
                $scope.showSubCategoryMenu = false;
                $scope.showCategoryMenu = $scope.showCategoryMenu ? false : true;
            };

            $scope.toggleSubCategoryMenu = function(categoryId) {                
                $scope.showCategoryMenu = false;
                $scope.showSubCategoryMenu = $scope.showSubCategoryMenu ? false : true;
                $scope.categoryName = categoryService.getCategoryName($scope.categories, categoryId);
                $scope.subCategories = categoryService.getSubCategoryList($scope.categories, categoryId);
                console.log($scope.subCategories);
            };

            $scope.toggleSubSubCategory = function(categoryId){
                if($scope.subSubCategoryIndex == -1) {
                    $scope.subSubCategoryIndex = categoryId;
                    $scope.preserveCategoryId = categoryId;
                }else{
                    if($scope.preserveCategoryId == categoryId){
                        $scope.subSubCategoryIndex = -1;
                    }else{
                        $scope.subSubCategoryIndex = categoryId;
                    }                    
                }
            };
           
            $scope.renderChildrenCategory = function(childCategories) {
                var strCategory = "";

                angular.forEach(childCategories, function(value, key){
                    if(key <= 0){
                        strCategory+=value.name;
                    }
                    if(key < 0){
                        strCategory+=", ";
                    }
                });
                return strCategory;
                
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

            $scope.isSpecialCategory = function(categoryId) {
                return categoryService.isSpecialCategory(categoryId);
            };

            $scope.logout = function() {

            };

            $scope.setCityLocation = function(city) {
                angular.forEach($scope.cityLocation, function(value, key){
                    $scope.cityLocation[key] = false;
                });
                $scope.cityLocation[city] = true;
                utility.setJStorageKey("selectedCity", city, 1);
                hideCitySelectionModal();
            };

            $scope.changeSearchKeyword = function(model) {
                $scope.searchKeyword = model;
            };

            $scope.handleSearchKeyEnter = function() {
                $location.url("product?keyword=" + $scope.searchKeyword)
            };

            
            $scope.showMoreCategory = function(category) {
                console.log(category);
                
                if($scope.moreCategoryIndex == -1) {
                    $scope.moreCategoryIndex = category.category_id;
                    $scope.preserveMoreCategoryId = category.category_id;
                }else{
                    if($scope.preserveMoreCategoryId == category.category_id){
                        $scope.moreCategoryIndex = -1;
                    }else{
                        $scope.moreCategoryIndex = category.category_id;
                    }                    
                }
            };

            angular.element(document).ready(function () {
                if(angular.isUndefined(utility.getJStorageKey("selectedCity"))
                    || !utility.getJStorageKey("selectedCity")) {
                    openCitySelectionModal();
                }                  
            });

        }
    ]);
});