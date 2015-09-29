define(['app'], function(app) {
	app.controller('productController',  [
        '$scope', '$rootScope', '$routeParams', '$location',  '$timeout', 'productService', 'categoryService', 'utility', 
        function($scope, $rootScope, $routeParams, $location, $timeout, productService, categoryService, utility) {            
            $scope.showSearchBar = false;
            $scope.showSearchIcon = false;
            $scope.showMoreIcon = false; 
            $scope.categoryName = "Dynamic Name";
            $scope.columnSize = 10;
            $scope.categoryId = angular.isDefined($routeParams.categoryId) ? $routeParams.categoryId : null ;
            $scope.dealId = angular.isDefined($routeParams.dealId) ? $routeParams.dealId : null ;
            $scope.productId = angular.isDefined($routeParams.productId) ? $routeParams.productId : null ;
            $scope.quoteId = angular.isDefined($routeParams.quoteId) ? $routeParams.quoteId : null ;
            $scope.parentCatId = angular.isDefined($routeParams.parentId) ? $routeParams.parentId : null ;
            $scope.products = null;
            $scope.productDetails = null;
            $scope.cartItems = [];
            $scope.cartItemCount = 0;
            $scope.showMoreMenuOptions = false;
            $scope.showUserMenuOptions = false;
            $scope.youSaved = 0;
            $scope.totalCartQty = 0;
            $scope.lastChildCategoryList = null;
            $scope.cityLocation = {
                "delhi": false,
                "gurgaon": false,
                "noida": false
            };
            $scope.keyword = angular.isDefined($routeParams.keyword) ? $routeParams.keyword : null ;
            $scope.productIds = [];
            $scope.isUserLoggedIn = angular.isDefined(utility.getJStorageKey("userId")) && utility.getJStorageKey("userId") ? true : false;
            
            openCitySelectionModal = function() {
                $timeout(function(){
                    $('#myModal').modal({
                        backdrop: false,
                        keyboard: false,
                        show: true
                    });
                }, 1000);
            };

            hideCitySelectionModal = function() {
                $('#myModal').modal('hide');
            };

            getProductListByCategoryId = function() {
                var jstorageKeyProducts = "products_" + $routeParams.categoryId;
                if (utility.getJStorageKey(jstorageKeyProducts)) {
                    $scope.products = utility.getJStorageKey(jstorageKeyProducts);
                } else {
                    productService.getProductListByCategoryId($scope.categoryId)
                        .then(function(data){
                            $scope.products = data.Product; 
                            utility.setJStorageKey(jstorageKeyProducts, $scope.products, 1);
                        });
                }
            };

            getProductListByDealId = function() {                
                productService.getProductListByDealId($scope.dealId)
                    .then(function(data){
                        $scope.products = data.Product.items; 
                    });                
            };
            
            getLastChildCategoryList = function() {
                if (utility.getJStorageKey("categories")) {
                    $scope.categories = utility.getJStorageKey("categories");
                    var catId = $scope.parentCatId ? $scope.parentCatId : $scope.categoryId; 
                    $scope.lastChildCategoryList = categoryService.getLastChildCategoryList($scope.categories, catId);
                } else {
                    categoryService.getCategoryList()
                        .then(function(data){
                            $scope.categories = data.Category.children[0].children;                        
                            utility.setJStorageKey("categories", $scope.categories, 1);
                            var catId = $scope.parentCatId ? parentCatId : $scope.categoryId;
                            $scope.lastChildCategoryList = categoryService.getLastChildCategoryList($scope.categories, catId);
                        });
                }
            };

            getProductListBySearch = function() {
                productService.getProductListBySearch($scope.keyword)
                    .then(function(data){
                        $scope.products = data.Product; 
                        //utility.setJStorageKey(jstorageKeyProducts, $scope.products, 1);
                    });
            };

            if($scope.categoryId){
               getLastChildCategoryList(); 
               getProductListByCategoryId();
            }

            if($scope.dealId){
                getProductListByDealId();
            }

            if($scope.keyword) {
                getProductListBySearch();
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
                var cartItems = [];
                cartItems.push(buildCartObject(product));
                utility.setJStorageKey("cartItems", cartItems, 1);                
            };            
            
            getCartItems = function() {                
                var cartItems = utility.getJStorageKey("cartItems");
                return cartItems.length ? cartItems : [];                
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
            if(angular.isDefined(utility.getJStorageKey("cartItems")) 
                && utility.getJStorageKey("cartItems")) {
                getCartDetails();
            }

            updateProductToJStorage = function(product) {
                var cartItems = utility.getJStorageKey("cartItems"),
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
                
                utility.setJStorageKey("cartItems", cartItems, 1);
                getCartDetails();
            };

            removeProductFromCart = function(product) {
                var cartItems = utility.getJStorageKey("cartItems"),
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
                utility.setJStorageKey("cartItems", cartItems, 1);
                getCartDetails();
            };  

            updateCartProducts = function(quoteId, cartItems) {
                productService.cartUpdateProduct(quoteId, cartItems, $scope.productIds)
                    .then(function(data){
                        //if(data.flag == 1 || data.flag == "1"){
                            if(angular.isDefined(utility.getJStorageKey("userId"))
                                && utility.getJStorageKey("userId")) {
                                $location.url("checkout/shipping");
                            } else {
                                $location.url("user/login?isReferrer=checkout");
                            }
                        //}                            
                    });
            };
            
            getYouSaveAmout = function() {
                var savedAmont = 0,
                    qty = 0;

                angular.forEach($scope.cartDetails.items, function(value, key) {
                    savedAmont = savedAmont + parseFloat($scope.getPriceDifference(value.mrp, value.price));
                    qty = qty + parseInt(value.qty);
                });
                $scope.youSaved = savedAmont;
                $scope.totalCartQty = qty;
            };

            getCartProductIds = function() {
                var productIds = [];
                angular.forEach($scope.cartDetails.items, function(value, key) {
                    if(value.apply_rule == "0") {
                        productIds.push(parseInt(value.product_id, 10));
                    }                    
                });
                $scope.productIds = productIds;
                console.log($scope.productIds);
            };

            getCartItemDetails = function() {
                productService.getCartItemDetails($scope.quoteId)
                    .then(function(data){              
                        $scope.cartDetails = data.CartDetail; 
                        getCartProductIds();             
                        getYouSaveAmout();
                    });
            };  

            if($scope.quoteId){
                console.log($scope.quoteId);
                console.log(utility.getJStorageKey("cartItems"));
                getCartItemDetails(); 
            }          

            //utility.deleteJStorageKey("quoteId");
            $scope.addProduct = function(product) {
                if(angular.isDefined(utility.getJStorageKey("cartItems"))
                    && utility.getJStorageKey("cartItems")) {
                     updateProductToJStorage(product);
                } else {
                    addProductToJStorage(product);
                    getCartDetails();
                }
            };

            $scope.removeProduct = function(product) {                
                if(angular.isDefined(utility.getJStorageKey("cartItems"))
                    && utility.getJStorageKey("cartItems")) {
                    removeProductFromCart(product);
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

            $scope.guestAddProduct = function() {
                if(angular.isDefined(utility.getJStorageKey("cartItems")) 
                    || utility.getJStorageKey("cartItems")) {                    
                    productService.cartAddProduct(utility.getJStorageKey("cartItems"))
                        .then(function(data){
                            if(data.flag == 1 || data.flag == "1"){
                                utility.setJStorageKey("quoteId", data.QuoteId, 1);
                                console.log("cart detail redirection");
                                $location.url("cart" + "/" + data.QuoteId);
                            }                            
                        });
                } else {
                    console.log("do nothing...");
                }
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

            $scope.routerChange = function(route, id) {
                $location.url(route + "/" + id);
            };  

            $scope.routerChangeChild = function(route, id, parentId) {
                console.log(route, id, parentId);
                $location.url("product/" + id + "?parentId="+parentId);                
            };

            $scope.replaceImageUrl = function(src) {
                return src;
            };

            $scope.getPriceDifference = function(price, salePrice) {
                return  (price - salePrice);    
            };
            
            $scope.getCartProductQuantity = function(productId) {
                var qty = 1;
                if($scope.cartItems.length) {
                    angular.forEach($scope.cartItems, function(value, key) {
                        if(productId == value.productid){
                            qty = value.quantity;
                        }
                    });
                }
                return qty;
            };            

            $scope.checkout = function() {
                var quoteId = utility.getJStorageKey("quoteId"),
                    cartItems = utility.getJStorageKey("cartItems");

                var products = [];
                if(cartItems.length) {
                    angular.forEach(cartItems, function(value, key){
                        var currentIndex = $scope.productIds.indexOf(value.productid);
                        if(currentIndex >= 0) {
                            $scope.productIds.splice(currentIndex, 1);
                        }
                    });
                }

                if(cartItems.length || $scope.productIds.length) {
                    updateCartProducts(quoteId, cartItems);
                }
            };

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
            
            $scope.toFixed = function(amt) {
                if(angular.isUndefined(amt)) {
                    return 0.00;
                }
                return amt.toFixed(2);
            };

            $scope.navigateToShipping = function() {
                $location.url("checkout/shipping");
            };

            $scope.setCityLocation = function(city) {
                angular.forEach($scope.cityLocation, function(value, key){
                    $scope.cityLocation[key] = false;
                });
                $scope.cityLocation[city] = true;
                utility.setJStorageKey("selectedCity", city, 1);
                hideCitySelectionModal();
            };

            angular.element(document).ready(function () {
                if(angular.isUndefined(utility.getJStorageKey("selectedCity"))
                    || !utility.getJStorageKey("selectedCity")) {
                    openCitySelectionModal();
                }                  
            });

        }
    ]);
});