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
            
            if (utility.getJStorageKey(jstorageKey)) {
                $scope.categories = utility.getJStorageKey(jstorageKey);
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
            }

            $scope.routerChange = function(route, id) {
                $location.url(route + "/" + id);
            };
        }
    ]);
});