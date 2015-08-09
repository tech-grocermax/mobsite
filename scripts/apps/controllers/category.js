define(['app'], function(app) {
	app.controller('categoryController',  [
        '$scope', '$rootScope', 'categoryService', 
        function($scope, $rootScope, categoryService){
        	$scope.categories = [];        	
        	categoryService.getCategoryList()
                .then(function(data){$scope.categories = data},function(error){return error});
        }
    ]);
});