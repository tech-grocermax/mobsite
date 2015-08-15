define(['app'], function(app) {
	app.controller('productController',  [
        '$scope', '$rootScope', '$routeParams', 'productService', 'utility', 
        function($scope, $rootScope, $routeParams, productService, utility){
        	console.log($routeParams.categoryId);
        	$scope.categoryId = $routeParams.categoryId;
        	$scope.products = [];
            var jstorageKey = "products_" + $routeParams.categoryId;

            if (utility.getJStorageKey(jstorageKey)) {
                console.log("IF");
                $scope.products = utility.getJStorageKey(jstorageKey);
            } else {
                console.log("ELSE");
                productService.getProductList($scope.categoryId)
                    .then(function(data){
                        $scope.products = data.Product; 
                        console.log($scope.products);
                        utility.setJStorageKey(jstorageKey, $scope.products, 1);
                    });
            }        	
        	
        }
    ]);
});