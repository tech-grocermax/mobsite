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
            $scope.quoteId = angular.isDefined($routeParams.quoteId) ? $routeParams.quoteId : (angular.isDefined(utility.getJStorageKey("quoteId")) && utility.getJStorageKey("quoteId") ? utility.getJStorageKey("quoteId") : null) ;
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
            $scope.keyword = angular.isDefined($routeParams.keyword) ? $routeParams.keyword : null ;
            $scope.productIds = [];
            $scope.isUserLoggedIn = angular.isDefined(utility.getJStorageKey("userId")) && utility.getJStorageKey("userId") ? true : false;
            $scope.productQty = {};
            $scope.isCartUpdated = false;
            $scope.cityList = null;
            $scope.cityLocation = {};

            toggleLoader = function(flag) {
                $scope.displayLoader = flag;
            };

            setDefaultProductQuantity = function() {
                if($scope.products.length) {
                    angular.forEach($scope.products, function(value, key) {
                        value["quantity"] = 1;
                    });
                }
            };

            getProductListByCategoryId = function() {
                var jstorageKeyProducts = "products_" + $routeParams.categoryId;
                if (utility.getJStorageKey(jstorageKeyProducts)) {
                    $scope.products = utility.getJStorageKey(jstorageKeyProducts);
                    setDefaultProductQuantity();
                } else {
                    toggleLoader(true);
                    productService.getProductListByCategoryId($scope.categoryId)
                        .then(function(data){
                            $scope.products = data.Product; 
                            setDefaultProductQuantity();
                            utility.setJStorageKey(jstorageKeyProducts, $scope.products, 1);
                            toggleLoader(false);
                        });
                }
            };

            getProductListByDealId = function() {       
                toggleLoader(true);         
                productService.getProductListByDealId($scope.dealId)
                    .then(function(data){
                        $scope.products = data.Product.items; 
                        setDefaultProductQuantity();
                        toggleLoader(false);
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
                toggleLoader(true);
                productService.getProductListBySearch($scope.keyword)
                    .then(function(data){
                        $scope.products = data.Product; 
                        toggleLoader(false);
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
                $scope.categoryName = "Product Description";
                var jstorageKeyProductDetails = "productDetails_" + $routeParams.productId;
                if (utility.getJStorageKey(jstorageKeyProductDetails)) {
                    $scope.productDetails = utility.getJStorageKey(jstorageKeyProductDetails);
                } else {
                    toggleLoader(true);
                    productService.getProductDetails($scope.productId)
                        .then(function(data){
                            $scope.productDetails = data.Product_Detail[0]; 
                            utility.setJStorageKey(jstorageKeyProductDetails, $scope.productDetails, 1);
                            toggleLoader(false);
                        });
                }
            };            

            if($scope.productId){
               getProductDetails(); 
            }
            
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
            
            getCartItemDetails = function() {
                toggleLoader(true);
                productService.getCartItemDetails($scope.quoteId)
                    .then(function(data){ 
                        toggleLoader(false);             
                        $scope.cartDetails = data.CartDetail;                         
                        $scope.cartItemCount = productService.getCartItemCount($scope.cartDetails.items);                          
                        getYouSaveAmout();
                    });
            };  

            if($scope.quoteId){
                getCartItemDetails(); 
                $scope.categoryName = "Your Cart";
            } 

            $scope.getCartProductQuantity = function(productId) {
                var qty = 1;
                if($scope.cartDetails.items.length) {
                    angular.forEach($scope.cartDetails.items, function(value, key) {
                        if(productId == value.product_id){
                            qty = value.qty;
                        }
                    });
                }
                return qty;
            };         

            //utility.deleteJStorageKey("quoteId");

            $scope.navigateToCart = function() {
                if(angular.isDefined(utility.getJStorageKey("quoteId")) 
                    && utility.getJStorageKey("quoteId")
                    && $scope.cartItemCount) {
                    $location.url("cart" + "/" + utility.getJStorageKey("quoteId"));
                } else {
                    console.log("ELSE");
                }
            };

            $scope.addProductOneByOne = function(product) {
                var quoteId = null,
                    productObject = [
                        {
                            "productid":product.productid, 
                            "quantity": product.quantity
                        }
                    ];

                if(angular.isDefined(utility.getJStorageKey("quoteId")) 
                    && utility.getJStorageKey("quoteId")) {
                    quoteId = utility.getJStorageKey("quoteId");
                }              

                productService.cartAddProduct(productObject, quoteId)
                    .then(function(data){
                        if(data.flag == 1 || data.flag == "1"){
                            if(!quoteId) {
                                utility.setJStorageKey("quoteId", data.QuoteId, 1);
                                $scope.quoteId = data.QuoteId;
                            }
                            getCartItemDetails();                                
                        }                            
                    });
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
                $location.url("product/" + id + "?parentId="+parentId);                
            };

            $scope.replaceImageUrl = function(src) {
                return src;
            };

            $scope.getPriceDifference = function(price, salePrice) {
                return price.replace(",", "") - salePrice.replace(",", "")
            }; 

            $scope.increaseProductQuantity = function(productId, keyName) {
                console.log(productId, keyName);
                angular.forEach($scope.products, function(value, key) {
                    if(value[keyName] == productId) {
                        value["quantity"] = parseInt(value["quantity"], 10) + 1;
                    }                    
                });
            };

            $scope.decreaseProductQuantity = function(productId, keyName) {
                console.log(productId, keyName);
                angular.forEach($scope.products, function(value, key) {
                    if(value[keyName] == productId && value["quantity"] > 1) {
                        value["quantity"] = parseInt(value["quantity"], 10) - 1;
                    }                    
                });
            };

            $scope.increaseCartProductQuantity = function(item, keyName) {
                $scope.isCartUpdated = true;
                console.log(item, keyName);
                var productId = item.product_id;
                angular.forEach($scope.cartDetails.items, function(value, key) {
                    if(value[keyName] == productId) {
                        value["qty"] = parseInt(value["qty"], 10) + 1;
                    }                    
                });
            };

            $scope.decreaseCartProductQuantity = function(item, keyName) {
                console.log(item, keyName);
                var productId = item.product_id;
                angular.forEach($scope.cartDetails.items, function(value, key) {
                    if(value[keyName] == productId && value["qty"] > 1) {
                        value["qty"] = parseInt(value["qty"], 10) - 1;
                        $scope.isCartUpdated = true;
                    }                    
                });
            };

            buildProductObject = function() {
                var products = [];
                angular.forEach($scope.cartDetails.items, function(value, key) {
                    if(value.apply_rule == 0) {
                        products.push({
                            "productid": parseInt(value.product_id, 10),
                            "quantity": parseInt(value.qty, 10)
                        });
                    }                   
                });   
                return products;             
            };

            $scope.checkout = function() {
                console.log("checkout");
                var quoteId = utility.getJStorageKey("quoteId"),
                    products = buildProductObject();

                productService.cartUpdateProduct(quoteId, products, $scope.productIds)
                    .then(function(data){
                        if(data.flag == 1 || data.flag == "1"){
                            if(angular.isDefined(utility.getJStorageKey("userId"))
                                && utility.getJStorageKey("userId")) {
                                $location.url("checkout/shipping");
                            } else {
                                $location.url("user/login?isReferrer=checkout");
                            }
                        }                            
                    });
            };    

            $scope.removeCartItem = function(product) {
                $scope.productIds.push(product.product_id);
            };

            /*$scope.checkout = function() {
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
            };*/

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
            };  
            
            $scope.toFixedDecimal = function(num) {
                if(angular.isUndefined(num)) {
                    return 0.00;
                }
                //return num.toFixed(2);
                num = parseFloat(num);
                var n = num.toFixed(2);
                return n;
            };

            $scope.navigateToShipping = function() {
                $location.url("checkout/shipping");
            };

            openCitySelectionModal = function() {
                $timeout(function(){
                    $('#myModal').modal({
                        backdrop: false,
                        keyboard: false,
                        show: true
                    });
                }, 1000);
            };

            getCityList = function() {
                utility.getCityList()
                    .then(function(data){
                        $scope.cityList = data.location;
                        angular.forEach($scope.cityList, function(value, key) {
                            var city = value.city_name.toLowerCase();
                            $scope.cityLocation[city] = false;
                        });
                        console.log($scope.cityLocation);
                        openCitySelectionModal();
                    });
            };

            hideCitySelectionModal = function() {
                $('#myModal').modal('hide');
            };

            $scope.setCityLocation = function(location) {
                var city = location.city_name.toLowerCase(),
                    cityId = location.id;

                angular.forEach($scope.cityLocation, function(value, key){
                    $scope.cityLocation[key] = false;
                });
                $scope.cityLocation[city] = true;
                utility.setJStorageKey("selectedCity", city, 1);
                utility.setJStorageKey("selectedCityId", location.id, 1);
                hideCitySelectionModal();
            };

            angular.element(document).ready(function () {
                if(angular.isUndefined(utility.getJStorageKey("selectedCity"))
                    || !utility.getJStorageKey("selectedCity")) {
                    getCityList();
                }                  
            });

        }
    ]);
});