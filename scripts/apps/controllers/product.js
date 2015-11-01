define(['app'], function(app) {
	app.controller('productController',  [
        '$scope', '$rootScope', '$http', '$routeParams', '$location',  '$timeout', 'productService', 'categoryService', 'utility', 
        function($scope, $rootScope, $http, $routeParams, $location, $timeout, productService, categoryService, utility) {            
            $scope.showSearchBar = false;
            $scope.showSearchIcon = false;
            $scope.showMoreIcon = false; 
            $scope.categoryName = "Dynamic Name";
            $scope.columnSize = 10;
            $scope.categoryId = angular.isDefined($routeParams.categoryId) ? $routeParams.categoryId : null ;
            $scope.dealId = angular.isDefined($routeParams.dealId) ? $routeParams.dealId : null ;
            $scope.productId = angular.isDefined($routeParams.productId) ? $routeParams.productId : null ;
            $scope.jStorageQuoteId = angular.isDefined(utility.getJStorageKey("quoteId")) && utility.getJStorageKey("quoteId") ? utility.getJStorageKey("quoteId") : null;
            $scope.quoteId = angular.isDefined($routeParams.quoteId) ? $routeParams.quoteId : null;
            $scope.parentCatId = angular.isDefined($routeParams.parentId) ? $routeParams.parentId : null ;
            $scope.products = [];
            $scope.productDetails = null;
            $scope.cartItems = [];
            $scope.cartItemCount = 0;
            $scope.showMoreMenuOptions = false;
            $scope.showUserMenuOptions = false;
            $scope.youSaved = 0;
            $scope.totalCartQty = 0;
            $scope.keyword = angular.isDefined($routeParams.keyword) ? $routeParams.keyword : null ;
            $scope.productIds = [];
            $scope.isUserLoggedIn = angular.isDefined(utility.getJStorageKey("userId")) && utility.getJStorageKey("userId") ? true : false;
            $scope.productQty = {};
            $scope.isCartUpdated = false;
            $scope.cityList = null;
            $scope.cityLocation = {};
            $scope.pagination = {
                current_page : 1,
                total_pages : 0
            };

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

            setPaginationTotal = function(totalCount) {
                $scope.pagination.total_pages = Math.ceil(totalCount/10)
            };

            getProductListByCategoryId = function() {                
                toggleLoader(true);
                productService.getProductListByCategoryId($scope.categoryId, $scope.pagination.current_page)
                    .then(function(data){
                        $scope.products = $scope.products || [];
                        $scope.products.push.apply($scope.products, data.Product);
                        setPaginationTotal(data.Totalcount);
                        setDefaultProductQuantity();
                        toggleLoader(false);
                    });                
            };

            getProductListByDealId = function() {       
                toggleLoader(true);         
                productService.getProductListByDealId($scope.dealId)
                    .then(function(data){
                        toggleLoader(false);                         
                        $scope.categoryName = data.Product.dealtitle;
                        if(angular.isDefined(data.Product.items)) {
                            $scope.products = data.Product.items;
                            setDefaultProductQuantity(); 
                        } else {
                            $scope.products = [];
                        }                                              
                    });                
            };
            
            groupSearchProductByCategory = function(data) {
                $scope.searchCategoryList = angular.isDefined(data.Category) ? data.Category : [];
                $scope.products = [];
                if($scope.searchCategoryList.length) {
                    angular.forEach($scope.searchCategoryList, function(value, key) {
                        var products = [];
                        angular.forEach(data.Product, function(innerValue, innerKey) {
                            if(value.category_id == innerValue.categoryid[0]) {
                                innerValue["quantity"] = 1;
                                products.push(innerValue);
                            }
                        });
                        value["products"] = products;
                        value["isSelected"] = (key == 0) ? true : false;
                    });
                    $scope.products = $scope.searchCategoryList[0]["products"];
                }
            };

            getProductListBySearch = function() {
                toggleLoader(true);
                productService.getProductListBySearch($scope.keyword)
                    .then(function(data){
                        groupSearchProductByCategory(data);
                        toggleLoader(false);
                    });
            };

            $scope.setSearchCategoryProducts = function(data, products) {
                angular.forEach($scope.searchCategoryList, function(value, key) {
                    value["isSelected"] = false;
                });
                data["isSelected"] = true;
                $scope.products = [];
                $scope.products = products;                
            };

            $scope.setAllCategoryProducts = function(data, products) {
                angular.forEach($scope.allProductCategoryList, function(value, key) {
                    value["isSelected"] = false;
                });
                data["isSelected"] = true;
                $scope.products = [];
                $scope.products = products;                
            };

            groupAllProductByCategory = function(data) {
                $scope.allProductCategoryList = angular.isDefined(data.ProductList) ? data.ProductList : [];
                if(angular.isDefined(data.hotproduct) && data.hotproduct.length) {
                    angular.forEach(data.hotproduct, function(value, key) {
                        $scope.allProductCategoryList.push(value);
                    });                    
                }

                $scope.products = [];
                if($scope.allProductCategoryList.length) {
                    angular.forEach($scope.allProductCategoryList, function(value, key) {
                        var products = [];
                        angular.forEach(value.product, function(innerValue, innerKey) {
                            innerValue["quantity"] = 1;
                        });
                        value["isSelected"] = (key == 0) ? true : false;
                    });
                    $scope.products = $scope.allProductCategoryList[0]["product"];
                }
            };

            getAllProductListByCategoryId = function() {
                toggleLoader(true);
                productService.getAllProductListByCategoryId($scope.categoryId)
                    .then(function(data){
                        console.log(data);
                        toggleLoader(false);
                        groupAllProductByCategory(data);
                    });
            };

            if($scope.categoryId){
               getAllProductListByCategoryId();
               $scope.categoryName = categoryService.getCategoryNameInDepth(utility.getJStorageKey("categories"), $scope.categoryId);
            }

            if($scope.dealId){
                getProductListByDealId();
            }

            if($scope.keyword) {
                $scope.categoryName = $scope.keyword;
                getProductListBySearch();
            }

            getProductDetails = function() {
                $scope.categoryName = "Product Description";                
                toggleLoader(true);
                productService.getProductDetails($scope.productId)
                    .then(function(data){
                        toggleLoader(false);
                        $scope.productDetails = data.Product_Detail[0];                        
                        $scope.productDetails.productid = $scope.productDetails.product_id;
                        $scope.productDetails.quantity = 1;
                    });                
            };            

            if($scope.productId){
               getProductDetails(); 
            }
            
            getYouSaveAmout = function() {
                var savedAmont = 0,
                    qty = 0;

                if(angular.isDefined($scope.cartDetails)) {
                    angular.forEach($scope.cartDetails.items, function(value, key) {
                        savedAmont = savedAmont + parseFloat($scope.getPriceDifference(value.mrp, value.price));
                        qty = qty + parseInt(value.qty);
                    });
                }
                $scope.youSaved = savedAmont;
                $scope.totalCartQty = qty;
            };
            
            getCartItemDetails = function() {
                toggleLoader(true);
                productService.getCartItemDetails($scope.quoteId)
                    .then(function(data){ 
                        toggleLoader(false);
                        if(data.flag == 0) {
                            $scope.cartDetails = [];
                            $scope.cartItemCount = 0;
                            utility.deleteJStorageKey("quoteId");
                            $scope.quoteId = null;
                        } else {
                            $scope.cartDetails = data.CartDetail; 
                            console.log($scope.cartDetails);

                            $scope.cartItemCount = productService.getCartItemCount($scope.cartDetails.items);                          
                            getYouSaveAmout();
                        }                        
                    });
            };  

            if($scope.quoteId){
                getCartItemDetails();                
            }                    
            if(angular.isDefined($routeParams.quoteId)) {
                $scope.categoryName = "Your Cart";
            }

            $scope.navigateToCart = function() {
                if(angular.isDefined(utility.getJStorageKey("quoteId")) 
                    && utility.getJStorageKey("quoteId")
                    && $scope.cartItemCount) {
                    $location.url("cart" + "/" + utility.getJStorageKey("quoteId"));
                } else {
                    console.log("ELSE");
                }
            };

            updateCartItemCounter = function(count, resetCartCounter) {
                var quoteId = utility.getJStorageKey("quoteId"),
                    cartCounterKey = "cartCounter" + quoteId,
                    cartCount = 0;

                if(angular.isDefined(resetCartCounter) && resetCartCounter) {
                    utility.setJStorageKey(cartCounterKey, cartCount, 1);
                }

                if(angular.isDefined(utility.getJStorageKey(cartCounterKey)) 
                    && utility.getJStorageKey(cartCounterKey) ) {
                    cartCount = utility.getJStorageKey(cartCounterKey);
                    cartCount = parseInt(cartCount, 10) + parseInt(count, 10);
                    utility.setJStorageKey(cartCounterKey, cartCount, 1);
                    $scope.cartItemCount = cartCount;
                } else {
                    utility.setJStorageKey(cartCounterKey, count, 1);
                    $scope.cartItemCount = count;
                }
            };

            getBasketItemCounter = function() {
                var quoteId = utility.getJStorageKey("quoteId"),
                    cartCounterKey = "cartCounter" + quoteId,
                    cartCount = 0;

                if(angular.isDefined(utility.getJStorageKey(cartCounterKey)) 
                    && utility.getJStorageKey(cartCounterKey) ) {
                    cartCount = utility.getJStorageKey(cartCounterKey);
                    $scope.cartItemCount = cartCount;
                }
            };

            if($scope.jStorageQuoteId) {
                getBasketItemCounter();
            }

            setProductBasketCounter = function(productId, count) {
                var quoteId = utility.getJStorageKey("quoteId");
                console.log(quoteId);

                if(angular.isDefined(utility.getJStorageKey("productBasketCount_" + quoteId)) 
                    && utility.getJStorageKey("productBasketCount_" + quoteId)) {  
                    var productBasketCount = utility.getJStorageKey("productBasketCount_" + quoteId);
                    if(angular.isDefined(productBasketCount[productId])) {
                        productBasketCount[productId] = parseInt(productBasketCount[productId], 10) + count;
                    } else {
                        productBasketCount[productId] = parseInt(count, 10);
                    }                    
                } else {
                    var productBasketCount = {};
                    productBasketCount[productId] = count;
                }
                utility.setJStorageKey("productBasketCount_" + quoteId, productBasketCount, 1);
                console.log(utility.getJStorageKey("productBasketCount_" + quoteId));
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

                toggleLoader(true);
                productService.cartAddProduct(productObject, quoteId)
                    .then(function(data){
                        toggleLoader(false);
                        if(data.flag == 1 || data.flag == "1"){
                            if(!quoteId) {
                                utility.setJStorageKey("quoteId", data.QuoteId, 1);
                                $scope.quoteId = data.QuoteId;
                            }
                            updateCartItemCounter(product.quantity);
                            setProductBasketCounter(product.productid, product.quantity);
                            //getCartItemDetails();                                
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

            $scope.getCartProductQuantity = function(productId) {                
                var qty = 0;
                if(angular.isDefined(utility.getJStorageKey("quoteId")) 
                    && utility.getJStorageKey("quoteId")) {
                    var quoteId = utility.getJStorageKey("quoteId");
                    if(angular.isDefined(utility.getJStorageKey("productBasketCount_" + quoteId)) 
                        && utility.getJStorageKey("productBasketCount_" + quoteId)) {  
                        var productBasketCount = utility.getJStorageKey("productBasketCount_" + quoteId);
                        qty = productBasketCount[productId];
                    }
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
                if(angular.isDefined(price) && angular.isDefined(salePrice)) {
                    return price.replace(",", "") - salePrice.replace(",", "");
                }                
            }; 

            $scope.increaseProductQuantity = function(productId, keyName) {
                angular.forEach($scope.products, function(value, key) {
                    if(value[keyName] == productId) {
                        value["quantity"] = parseInt(value["quantity"], 10) + 1;
                    }                    
                });
            };

            $scope.decreaseProductQuantity = function(productId, keyName) {
                angular.forEach($scope.products, function(value, key) {
                    if(value[keyName] == productId && value["quantity"] > 1) {
                        value["quantity"] = parseInt(value["quantity"], 10) - 1;
                    }                    
                });
            };

            $scope.increaseProductDetailQuantity = function(productId, keyName) {
                $scope.productDetails["quantity"] = parseInt($scope.productDetails["quantity"], 10) + 1;                    
            };

            $scope.decreaseProductDetailQuantity = function(productId, keyName) {
                if($scope.productDetails["quantity"] > 1) {
                    $scope.productDetails["quantity"] = parseInt($scope.productDetails["quantity"], 10) - 1;
                }
            };

            $scope.increaseCartProductQuantity = function(item, keyName) {
                console.log(keyName, item.product_id);
                $scope.isCartUpdated = true;
                var productId = item.product_id;
                angular.forEach($scope.cartDetails.items, function(value, key) {
                    if(value[keyName] == productId) {
                        value["qty"] = parseInt(value["qty"], 10) + 1;
                    }                    
                });
            };

            $scope.decreaseCartProductQuantity = function(item, keyName) {
                var productId = item.product_id;
                angular.forEach($scope.cartDetails.items, function(value, key) {
                    if(value[keyName] == productId && value["qty"] > 1) {
                        value["qty"] = parseInt(value["qty"], 10) - 1;
                        $scope.isCartUpdated = true;
                    }                    
                });
            };

            $scope.removeCartItem = function(product) {
                $scope.isCartUpdated = true;
                $scope.productIds.push(product.product_id);
                if($scope.cartDetails.items.length == 1) {
                    $scope.checkout('update');
                }
            };

            $scope.hideCartItem = function(product) {
                var productId = parseInt(product.product_id, 10);
                return $scope.productIds.indexOf(product.product_id) >= 0 ? true : false; 
            };

            checkoutSuccessCallback = function(flag) {
                if(flag == "update") {
                    $scope.isCartUpdated = false;
                    //getCartItemDetails();
                } else {
                    toggleLoader(false);
                    if(angular.isDefined(utility.getJStorageKey("userId"))
                        && utility.getJStorageKey("userId")) {
                        $location.url("checkout/shipping");
                    } else {
                        $location.url("user/login?isReferrer=checkout");
                    }
                }                
            };

            buildProductObject = function() {
                var products = [];

                angular.forEach($scope.cartDetails.items, function(value, key) {
                    if(value.apply_rule == 0 
                        && $scope.productIds.indexOf(value.product_id) == -1) {
                        products.push({
                            "productid": parseInt(value.product_id, 10),
                            "quantity": parseInt(value.qty, 10)
                        });
                    }                   
                });
                return products;             
            };

            resetProductBasketCounter = function(productId, count) {
                var quoteId = utility.getJStorageKey("quoteId");
                console.log(quoteId);

                if(angular.isDefined(utility.getJStorageKey("productBasketCount_" + quoteId)) 
                    && utility.getJStorageKey("productBasketCount_" + quoteId)) {  
                    var productBasketCount = utility.getJStorageKey("productBasketCount_" + quoteId);                    
                    productBasketCount[productId] = parseInt(count, 10);                                        
                } else {
                    var productBasketCount = {};
                    productBasketCount[productId] = count;
                }
                utility.setJStorageKey("productBasketCount_" + quoteId, productBasketCount, 1);
                console.log(utility.getJStorageKey("productBasketCount_" + quoteId));
            };

            $scope.checkout = function(flag) {
                if(flag == 'checkout') {
                    checkoutSuccessCallback('checkout')
                } else {
                    var quoteId = utility.getJStorageKey("quoteId"),
                        products = buildProductObject();

                    toggleLoader(true);
                    productService.cartUpdateProduct(quoteId, products, $scope.productIds)
                        .then(function(data){
                            toggleLoader(false);
                            if(data.flag == 1 || data.flag == "1"){
                                var totalQty = productService.getCartItemCount(data.CartDetail.items);
                                updateCartItemCounter(totalQty, true);
                                utility.deleteJStorageKey("productBasketCount_" + quoteId);
                                angular.forEach(data.CartDetail.items, function(value, key) {
                                    resetProductBasketCounter(value.product_id, value.qty);
                                });
                                $scope.productIds = [];                           
                                checkoutSuccessCallback(flag);                            
                            }                            
                        });
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
            };  
            
            $scope.toFixedDecimal = function(num) {
                if(angular.isDefined(num)) {
                    num = parseFloat(num);
                    return num.toFixed(2);
                }                
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

            $scope.getCityImgSrc = function(location) {
                if(angular.isDefined(location)) {
                    var city = location.city_name.toLowerCase();
                    return $scope.cityLocation[city] ? 'selected.png' : '-unselected.png';
                } else {
                    return '-unselected.png';
                }                
            };

            // Page bottom touch event handler
            $scope.$on('endlessScroll:next', function() {
                if($scope.pagination.current_page < $scope.pagination.total_pages) {                    
                    $scope.pagination.current_page = $scope.pagination.current_page + 1;
                    if($scope.categoryId){
                       getProductListByCategoryId();
                    }
                }                
            });

            angular.element(document).ready(function () {
                if(angular.isUndefined(utility.getJStorageKey("selectedCity"))
                    || !utility.getJStorageKey("selectedCity")) {
                    getCityList();
                }                  
            });

        }
    ]);
});