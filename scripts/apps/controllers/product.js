define(['app'], function(app) {
	app.controller('productController',  [
        '$scope', '$rootScope', '$routeParams', '$location', 'productService', 'utility', 
        function($scope, $rootScope, $routeParams, $location, productService, utility) {
                        
        	$scope.products = null;
            $scope.productDetails = null;
            $scope.categoryId = angular.isDefined($routeParams.categoryId) ? $routeParams.categoryId : null ;
            $scope.productId = angular.isDefined($routeParams.productId) ? $routeParams.productId : null ;
            $scope.showSearchBar = false;
            $scope.showSearchIcon = false;
            $scope.showMoreIcon = true;
            
            var jstorageKeyProducts = "products_" + $routeParams.categoryId;
            var jstorageKeyProductDetails = "productDetails_" + $routeParams.productId;        	            

            $scope.getProductList = function() {
                if (utility.getJStorageKey(jstorageKeyProducts)) {
                    $scope.products = utility.getJStorageKey(jstorageKeyProducts);
                    console.log($scope.products);
                } else {
                    productService.getProductList($scope.categoryId)
                        .then(function(data){
                            $scope.products = data.Product; 
                            utility.setJStorageKey(jstorageKeyProducts, $scope.products, 1);
                        });
                }
            };

            if($scope.categoryId){
               $scope.getProductList(); 
            }

            $scope.getProductDetails = function() {
                if (utility.getJStorageKey(jstorageKeyProductDetails)) {
                    $scope.productDetails = utility.getJStorageKey(jstorageKeyProductDetails);
                    console.log($scope.productDetails);
                } else {
                    productService.getProductDetails($scope.productId)
                        .then(function(data){
                            $scope.productDetails = data.Product_Detail[0]; 
                            utility.setJStorageKey(jstorageKeyProductDetails, $scope.productDetails, 1);
                        });
                }
            };            

            if($scope.productId){
               $scope.getProductDetails(); 
            }

            $scope.routerChange = function(route, id) {
                $location.url(route + "/" + id);
            };

            $scope.replaceImageUrl = function(src) {
                //console.log(src.replace("image/", "small_image/190x190/"));
                if(src.indexOf("placeholder") >= 0){
                    return "images/small_image_1_2_1.jpg"
                }else {
                    return src.replace("image/", "small_image/190x190/");    
                }
                
            };

            $scope.getPriceDifference = function(price, salePrice) {
                return  (price - salePrice);    
            };

            $scope.categoryName = "web service cat";
            $scope.columnSize = 4;

        }
    ]);
});