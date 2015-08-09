define(['app'], function(app) {
	app.controller('categoryController',  [
        '$scope', '$rootScope', 'categoryService', 
        function($scope, $rootScope, categoryService){
        	$scope.categories = []; 

            $scope.categoryIndex = -1;
            $scope.subCategoryIndex = -1;
            //$scope.subSubcategoryIndex = -1;

        	categoryService.getCategoryList()
                .then(
                    function(data){$scope.categories = data.Category.children[0].children; console.log($scope.categories)},
                    function(error){console.log(error);}
                );
        }
    ]);
});