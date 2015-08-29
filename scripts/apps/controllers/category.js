define(['app'], function(app) {
	app.controller('categoryController',  [
        '$scope', '$rootScope', '$location', '$routeParams', 'categoryService', 'utility', 
        function($scope, $rootScope, $location, $routeParams, categoryService, utility){
        	var jstorageKey = "categories";
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

            if (utility.getJStorageKey(jstorageKey)) {
                $scope.categories = utility.getJStorageKey(jstorageKey);
                console.log($scope.categories);
            } else {
        	   categoryService.getCategoryList()
                    .then(function(data){
                        $scope.categories = data.Category.children[0].children; 
                        utility.setJStorageKey(jstorageKey, $scope.categories, 1);
                    });
            }

            if ($routeParams.categoryId) {
                $scope.subCategoryList = categoryService.getSubCategoryList($scope.categories, $routeParams.categoryId);
                $scope.categoryName = categoryService.getCategoryName($scope.categories, $routeParams.categoryId);
                console.log($scope.categoryName);
                $scope.columnSize = 4;
            }else{
                $scope.columnSize = 1;
            }

            $scope.routerChange = function(route, id) {
                route = angular.isDefined(id) ? route + ("/" + id) : route;
                $location.url(route);
            };

            $scope.toggleCategoryMenu = function() {
                $scope.showSubCategoryMenu = false;
                $scope.showCategoryMenu = $scope.showCategoryMenu ? false : true;
                console.log($scope.showCategoryMenu);
            };

            $scope.toggleSubCategoryMenu = function(categoryId) {
                console.log($scope.categories);
                console.log(categoryId);
                $scope.showCategoryMenu = false;
                $scope.showSubCategoryMenu = $scope.showSubCategoryMenu ? false : true;
                console.log($scope.showSubCategoryMenu);
                $scope.categoryName = categoryService.getCategoryName($scope.categories, categoryId);
                $scope.subCategories = categoryService.getSubCategoryList($scope.categories, categoryId);
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
                    if(key <= 1){
                        strCategory+=value.name;
                    }
                    if(key < 1){
                        strCategory+=", ";
                    }
                });
                return strCategory;
                
            };

            $scope.showMoreMenu = function() {
                $scope.showMoreMenuOptions = $scope.showMoreMenuOptions ? false : true;
            };
        }
    ]);
});