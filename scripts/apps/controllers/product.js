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
            
            var jstorageKeyProducts = "products_" + $routeParams.categoryId,
                jstorageKeyProductDetails = "productDetails_" + $routeParams.productId;        	            

            $scope.getProductList = function() {
                if (utility.getJStorageKey(jstorageKeyProducts)) {
                    $scope.products = utility.getJStorageKey(jstorageKeyProducts);
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
                return src.indexOf("placeholder") >= 0 
                    ? "images/small_image_1_2_1.jpg" : src.replace("image/", "small_image/190x190/");
            };

            $scope.getPriceDifference = function(price, salePrice) {
                return  (price - salePrice);    
            };

            $scope.categoryName = "web service cat";
            $scope.columnSize = 4;
            $scope.cartItems = [];

            buildCartObject = function(product) {
                return {
                    "productid": parseInt(product.productid, 10),
                    "quantity": 1
                };
            };

            buildAddProductObject = function(product) {
                var products = [],
                    cartObject = buildCartObject(product);
                    
                products.push(cartObject);                
                return products;
            };

            addProductToJStorage = function(product) {
                var quoteId = utility.getJStorageKey("quoteId"),
                    cartObject = buildCartObject(product),
                    cartItems = {};

                cartItems[quoteId] = [];
                cartItems[quoteId].push(cartObject);
                utility.setJStorageKey("cartItems", cartItems, 1);                
            };
            
            $scope.cartItems = [];
            $scope.cartItemCount = 0;
            getCartItems = function() {                
                var quoteId = utility.getJStorageKey("quoteId"),
                    cartItems = utility.getJStorageKey("cartItems");

                return quoteId ? cartItems[quoteId] : [];                
            };

            getCartItemCounter = function() {
                var count = 0;
                angular.forEach($scope.cartItems, function(value, key){
                    count = count + parseInt(value.quantity, 10);
                });
                return count;
            };

            getCartDetails = function() {
                $scope.cartItems = getCartItems();
                $scope.cartItemCount = getCartItemCounter();                
            };
            if(angular.isDefined(utility.getJStorageKey("quoteId")) 
                && utility.getJStorageKey("quoteId")) {
                console.log(utility.getJStorageKey("quoteId"));
                getCartDetails();
            }
            //console.log($scope.cartItems);

            updateProductToJStorage = function(quoteId, product) {
                var cartItemObject = utility.getJStorageKey("cartItems"),
                    cartItems = cartItemObject[quoteId],
                    isOperated = false,
                    findKey = null,
                    obj = {};

                if(cartItems.length) {
                    angular.forEach(cartItems, function(value, key) {
                        if(parseInt(product.productid, 10) == parseInt(value.productid, 10)) {
                            value.quantity = parseInt(value.quantity, 10) + 1;
                            isOperated = true;
                        }
                    });
                    if(!isOperated) {
                        var cartObject = buildCartObject(product);
                        cartItems.push(cartObject);  
                        isOperated = true;
                    }
                } else {
                    var cartObject = buildCartObject(product);
                    cartItems.push(cartObject);
                }
                
                obj[quoteId] = cartItems;
                utility.setJStorageKey("cartItems", obj, 1);
                getCartDetails();
            };

            removeProductFromCart = function(quoteId, product) {
                var cartItemObject = utility.getJStorageKey("cartItems"),
                    cartItems = cartItemObject[quoteId],
                    isOperated = false,
                    obj = {};

                angular.forEach(cartItems, function(value, key){
                    if(parseInt(product.productid, 10) == parseInt(value.productid, 10)) {
                        if(value.quantity > 1) {
                            if(!isOperated) {
                                value.quantity = parseInt(value.quantity, 10) - 1;
                                isOperated = true;
                            } 
                        } else {
                            if(!isOperated) {
                                cartItems.splice(key, 1);
                                isOperated = true;
                            }
                        }                      
                    }
                });
                obj[quoteId] = cartItems;
                utility.setJStorageKey("cartItems", obj, 1);
                getCartDetails();
            };

            //utility.deleteJStorageKey("quoteId");
            $scope.addProduct = function(product) {
                if(angular.isUndefined(utility.getJStorageKey("quoteId")) 
                    || !utility.getJStorageKey("quoteId")) {
                    productService.addProduct(buildAddProductObject(product))
                        .then(function(data){
                            if(data.flag == 1 || data.flag == "1"){
                                utility.setJStorageKey("quoteId", data.QuoteId, 1);
                                addProductToJStorage(product);
                                getCartDetails();
                            }                            
                        });
                } else {
                    var quoteId = utility.getJStorageKey("quoteId");
                    updateProductToJStorage(quoteId, product);
                }
            };

            $scope.removeProduct = function(product) {                
                if(angular.isDefined(utility.getJStorageKey("quoteId"))) {
                    var quoteId = utility.getJStorageKey("quoteId");
                    removeProductFromCart(quoteId, product);
                }
            };

            $scope.addProductWrapper = function(product) {
                product.productid = product.product_id;
                $scope.addProduct(product);
            };

            $scope.removeProductWrapper = function(product) {
                product.productid = product.product_id;
                $scope.removeProduct(product);
            };

            $scope.getProductQuantity = function(productId) {
                var qty = 0;
                if($scope.cartItems.length) {
                    angular.forEach($scope.cartItems, function(value, key) {
                        if(productId == value.productid){
                            qty = value.quantity;
                        }
                    });
                }
                return qty;
            };

            $scope.getCartDetails = function() {
                if(angular.isDefined(utility.getJStorageKey("quoteId"))) {
                    var quoteId = utility.getJStorageKey("quoteId"),
                        cartItemObject = utility.getJStorageKey("cartItems"),
                        cartItems = cartItemObject[quoteId];

                    productService.addProduct(cartItems, quoteId)
                        .then(function(data){
                            if(data.flag == 1 || data.flag == "1"){
                                console.log("cart detail redirection");
                            }                            
                        });                    
                }
            };
        }
    ]);
});