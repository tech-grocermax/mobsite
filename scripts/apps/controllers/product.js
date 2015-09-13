define(['app'], function(app) {
	app.controller('productController',  [
        '$scope', '$rootScope', '$routeParams', '$location', 'productService', 'utility', 
        function($scope, $rootScope, $routeParams, $location, productService, utility) {            
            $scope.showSearchBar = false;
            $scope.showSearchIcon = false;
            $scope.showMoreIcon = true; 
            $scope.categoryName = "web service cat";
            $scope.columnSize = 4;
            $scope.categoryId = angular.isDefined($routeParams.categoryId) ? $routeParams.categoryId : null ;
            $scope.productId = angular.isDefined($routeParams.productId) ? $routeParams.productId : null ;
            $scope.quoteId = angular.isDefined($routeParams.quoteId) ? $routeParams.quoteId : null ;
            $scope.products = null;
            $scope.productDetails = null;
            $scope.cartItems = [];
            $scope.cartItemCount = 0;
            $scope.showMoreMenuOptions = false;
            $scope.showUserMenuOptions = false;
            
            getProductList = function() {
                var jstorageKeyProducts = "products_" + $routeParams.categoryId;
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
               getProductList(); 
            }

            getProductDetails = function() {
                var jstorageKeyProductDetails = "productDetails_" + $routeParams.productId;
                if (utility.getJStorageKey(jstorageKeyProductDetails)) {
                    $scope.productDetails = utility.getJStorageKey(jstorageKeyProductDetails);
                } else {
                    productService.getProductDetails($scope.productId)
                        .then(function(data){
                            $scope.productDetails = data.Product_Detail[0]; 
                            utility.setJStorageKey(jstorageKeyProductDetails, $scope.productDetails, 1);
                        });
                }
            };            

            if($scope.productId){
               getProductDetails(); 
            }

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
                getCartDetails();
            }

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
                    productService.cartAddProduct(buildAddProductObject(product))
                        .then(function(data){
                            if(data.flag == 1 || data.flag == "1"){
                                utility.setJStorageKey("quoteId", data.QuoteId, 1);
                                utility.setJStorageKey("firstAddedProduct",
                                    product.productid, 1);
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

            $scope.cartUpdateProducts = function() {
                if(angular.isDefined(utility.getJStorageKey("quoteId"))) {
                    var quoteId = utility.getJStorageKey("quoteId"),
                        cartItemObject = utility.getJStorageKey("cartItems"),
                        cartItems = cartItemObject[quoteId],
                        firstAddedProduct = utility.getJStorageKey("firstAddedProduct");

                    productService.cartUpdateProduct(cartItems, quoteId, firstAddedProduct)
                        .then(function(data){
                            if(data.flag == 1 || data.flag == "1"){
                                console.log("cart detail redirection");
                                $location.url("cart" + "/" + quoteId);
                            }                            
                        });                    
                }
            };

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

            getCartItemDetails = function() {
                productService.getCartItemDetails($scope.quoteId)
                        .then(function(data){                            
                            $scope.cartItems = data.CartDetail.items;
                            console.log($scope.cartItems);
                        });
            };  

            if($scope.quoteId){
                getCartItemDetails(); 
            }   

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

        }
    ]);
});