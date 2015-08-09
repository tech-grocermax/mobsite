define(['app'], function(app) {
	app.controller('productController',  [
        '$scope', '$rootScope', 'productService', '$routeParams',
        function($scope, $rootScope, productService,$routeParams){
        	console.log($routeParams.categoryId);
        	$scope.categoryId = $routeParams.categoryId;
        	$scope.products = [];        	
        	productService.getProductList($scope.categoryId)
                .then(function(data){$scope.products = data.Product; console.log($scope.products);},function(error){return error});
        }
    ]);
});