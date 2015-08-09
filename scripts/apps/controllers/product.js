define(['app'], function(app) {
	app.controller('productController',  [
        '$scope', '$rootScope', 'productService', 
        function($scope, $rootScope, productService){
        	$scope.products = [];        	
        	productService.getProductList()
                .then(function(data){$scope.products = data.Product_Detail},function(error){return error});
        }
    ]);
});