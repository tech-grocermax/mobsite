define(['app'], function(app) {
	app.controller('productController',  [
        '$scope', '$rootScope', '$http', '$routeParams', '$location',  '$timeout', 'productService', 'categoryService', 'utility', '$analytics',
        function($scope, $rootScope, $http, $routeParams, $location, $timeout, productService, categoryService, utility, $analytics) {            
            $scope.showSearchBar = false;
            $scope.showSearchIcon = false;
            $scope.showMoreIcon = false; 
            $scope.categoryName = "";
            $scope.categoryId = angular.isDefined($routeParams.categoryId) ? $routeParams.categoryId : null ;
            $scope.dealId = angular.isDefined($routeParams.dealId) ? $routeParams.dealId : null ;
            $scope.productId = angular.isDefined($routeParams.productId) ? $routeParams.productId : null ;
            $scope.jStorageQuoteId = angular.isDefined(utility.getJStorageKey("quoteId")) && utility.getJStorageKey("quoteId") ? utility.getJStorageKey("quoteId") : null;
            $scope.quoteId = angular.isDefined($routeParams.quoteId) ? $routeParams.quoteId : null;
            $scope.parentCatId = angular.isDefined($routeParams.parentId) ? $routeParams.parentId : null ;
            /*if($routeParams.specialDealLinkurl){
                $scope.specialDealLinkurl = angular.isDefined($routeParams.specialDealLinkurl.split("=")[0]) ? $routeParams.specialDealLinkurl.split("=")[0] : null ;
                $scope.specialDealName = angular.isDefined($routeParams.specialDealLinkurl.split("=")[1]) ? $routeParams.specialDealLinkurl.split("=")[1] : null ;
            }*/
            $scope.specialDealLinkurl = angular.isDefined($routeParams.specialDealLinkurl) ? $routeParams.specialDealLinkurl : null ;
            $scope.topOfferDealId = angular.isDefined($routeParams.dealCategoryId) ? $routeParams.dealCategoryId : null ;
            $scope.products = [];
            $scope.productDetails = null;
            $scope.specialdeals = null;
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
            $scope.SpecialDealName = "";

            $scope.isProductLoaded = false;
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
                        //setPaginationTotal(data.Totalcount);
                        setDefaultProductQuantity();
                        toggleLoader(false);
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
                        $scope.isProductLoaded = true;
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
                $(window).scrollTop(0);
                $scope.categoryId = data.category_id;
                $scope.pagination.current_page = 1;
                setPaginationTotal(data.Totalcount);
                angular.forEach($scope.allProductCategoryList, function(value, key) {
                    value["isSelected"] = false;
                });
                data["isSelected"] = true;
                $scope.products = [];
                $scope.products = products;
            };

            // Without using var, this makes the function global. Please add var if convinient or delete this comment.
            groupAllProductByCategory = function(data) {
                var hotProducts = [],
                    allProducts = [];
                $scope.allProductCategoryList = [];       
                if(angular.isDefined(data.hotproduct) && data.hotproduct.length) {
                    angular.forEach(data.hotproduct, function(value, key) {
                        hotProducts.push(value);
                    });                    
                }
                //allProducts = angular.isDefined(data.ProductList) ? data.ProductList : [];
                if($scope.topOfferDealId){
                    allProducts = angular.isDefined(data.dealcategory.category) ? data.dealcategory.category : [];
                } else if($scope.dealId){
                    allProducts = angular.isDefined(data.dealcategory.category) ? data.dealcategory.category : [];
                }
                    else{
                        allProducts = angular.isDefined(data.ProductList) ? data.ProductList : [];
                    }
                $scope.allProductCategoryList = hotProducts.concat(allProducts);
                $scope.products = $scope.products || [];
                if($scope.allProductCategoryList.length) {
                    angular.forEach($scope.allProductCategoryList, function(value, key) {
                        var products = [];
                        if($scope.topOfferDealId){
                            angular.forEach(value.deals, function(innerValue, innerKey) {
                                innerValue["quantity"] = 1;
                            });
                        }else if($scope.dealId){
                            angular.forEach(value.deals, function(innerValue, innerKey) {
                                innerValue["quantity"] = 1;
                            });
                        }
                            else{
                                angular.forEach(value.product, function(innerValue, innerKey) {
                                    innerValue["quantity"] = 1;
                                });
                            }
                        
                        value["isSelected"] = (key == 0) ? true : false;
                    });
                    //$scope.products = $scope.allProductCategoryList[0]["product"];
                    if($scope.topOfferDealId){
                        $scope.products.push.apply($scope.products, $scope.allProductCategoryList[0]["deals"]);
                    }else if($scope.dealId){
                        $scope.products.push.apply($scope.products, $scope.allProductCategoryList[0]["deals"]);
                    }
                        else{
                            $scope.products.push.apply($scope.products, $scope.allProductCategoryList[0]["product"]);
                        }
                    setPaginationTotal($scope.products.length);
                    toggleLoader(false);
                }
            };   

            getAllProductListByCategoryId = function() {
                toggleLoader(true);
                productService.getAllProductListByCategoryId($scope.categoryId, $scope.pagination.current_page)
                    .then(function(data){
                        groupAllProductByCategory(data);
                        $scope.isProductLoaded = true;
                        $('body').css('overflow', 'auto');
                    });
            };

            getProductListByDealId = function() {       
                toggleLoader(true);       
                productService.getDealsByDealId($scope.dealId, $scope.pagination.current_page)
                    .then(function(data){
                        $scope.categoryName = data.dealcategory.name;
                        groupAllProductByCategory(data);
                        $scope.isProductLoaded = true;
                        $('body').css('overflow', 'auto');                                     
                    });                
            };
    
            if($scope.dealId){
                getProductListByDealId();
            }

            if($scope.categoryId){
                getAllProductListByCategoryId();
                $scope.categoryName = categoryService.getCategoryNameInDepth(utility.getJStorageKey("categories"), $scope.categoryId);
            }

            getSpecialDealByLinkurl = function() {
                toggleLoader(true);
                productService.getSpecialDealListBySku($scope.specialDealLinkurl, $scope.pagination.current_page)
                    .then(function(data){
                        groupAllProductByCategory(data);
                        $scope.isProductLoaded = true;
                        $('body').css('overflow', 'auto');
                        $scope.products = $scope.products || [];
                        $scope.products.push.apply($scope.products, data.Product.items);
                        setDefaultProductQuantity();
                        toggleLoader(false);
                    });
            }


            if($scope.specialDealLinkurl){
                getSpecialDealByLinkurl();
                $scope.SpecialDealName = categoryService.getSpecialDealName(utility.getJStorageKey("specialDeals"), $scope.specialDealLinkurl);
                //$scope.SpecialDealName = $scope.specialDealName;
            }

            if($scope.topOfferDealId){
                toggleLoader(true);
                categoryService.getDealsByDealCategoryId($scope.topOfferDealId)
                    .then(function(data){
                        $scope.topofferdealname = data.dealcategory.name;
                    groupAllProductByCategory(data);
                        $scope.isProductLoaded = true;
                        $('body').css('overflow', 'auto');   
                        toggleLoader(false);                            
                    });
            }

            if($scope.dealId){
                getProductListByDealId();
            }

            if($scope.keyword) {
                $scope.categoryName = $scope.keyword;
                getProductListBySearch();
            }

            $scope.navigateToProduct = function(route, itemId) {
                $location.url(route + "/deal/" + itemId);
            };

            getProductDetails = function() {
                $scope.isProductDetailsLoaded = false;
                $scope.categoryName = "Product Description";                
                toggleLoader(true);
                productService.getProductDetails($scope.productId)
                    .then(function(data){
                        toggleLoader(false);
                        $scope.isProductDetailsLoaded = true;
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
						var amt = 0;
                        amt = parseInt(value.qty) * parseFloat($scope.getPriceDifference(value.mrp, value.price))
                        savedAmont = savedAmont + amt;
                        qty = qty + parseInt(value.qty);
                    });
                }
                $scope.youSaved = savedAmont;
                $scope.totalCartQty = qty;
            };

            var addShippingCharges = function() {
                if($scope.cartDetails.grand_total < 250 && $scope.cartDetails.shipping_address.shipping_amount <= 0) {
                    $scope.cartDetails.shipping_address.shipping_amount = 50;
                    $scope.cartDetails.grand_total = parseFloat($scope.cartDetails.grand_total) + parseFloat($scope.cartDetails.shipping_address.shipping_amount);
                }                
            };
            
            $scope.isCartLoaded = false;            
            getCartItemDetails = function() {
                toggleLoader(true);
                productService.getCartItemDetails($scope.quoteId)
                    .then(function(data){
                        $scope.isCartLoaded = true;
                        toggleLoader(false);
                        if(data.flag == 0) {
                            $scope.cartDetails = [];
                            $scope.cartItemCount = 0;
                            utility.deleteJStorageKey("quoteId");
                            $scope.quoteId = null;
                        } else {
                            $('body').css('overflow', 'auto');
                            $scope.cartDetails = data.CartDetail;
                            $scope.cartItemCount = productService.getCartItemCount($scope.cartDetails.items);                          
                            addShippingCharges();
                            getYouSaveAmout();
                            if(data.TotalItem == 0) {
                                utility.setJStorageKey("cartCounter" + $scope.quoteId, 0, 1);
                                $location.url("/");
                            } else {
                                utility.setJStorageKey("cartCounter" + $scope.quoteId, data.TotalItem, 1);
                            }
							
							angular.forEach($scope.cartDetails.items, function(value, key) {
								$scope.soldOutItemNeg = parseInt(value.webqty, 10);
								if($scope.soldOutItemNeg <= 0){
									$scope.isCartUpdated = true;
									
								}
							});
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
            };

            $scope.addProductOneByOne = function(product) {
                
                // Tracking add to cart
                $analytics.eventTrack($scope.selectedCity, {  category: "Add to Cart", label: ( product.productid + " - " + product.Name + " - " + product.quantity) });

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
                $scope.isCartUpdated = true;
                var productId = item.product_id;
                angular.forEach($scope.cartDetails.items, function(value, key) {
                    if(value[keyName] == productId && value.price > 0) {
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

            var isCartContainsSingleItem = function() {
                var itemCount = 0;
                angular.forEach($scope.cartDetails.items, function(value, key) {
                    if(value.price > 0) {
                        itemCount++;
                    }
                });
                return (itemCount == 1)  ? true : false;
            };

            $scope.removeCartItem = function(product) {
                $scope.isCartUpdated = true;
                $scope.productIds.push(product.product_id);
				
				
				
				$scope.listItemUpdateClassCount = [];
				
				var resultCount = document.getElementsByClassName("UpdateCart"),
				    resultCountHide = document.getElementsByClassName("UpdateCart ng-hide");
					
				$scope.resultCountShow = resultCount.length - resultCountHide.length; //Mustakeem 	
				if(isCartContainsSingleItem()) {
                    $scope.checkout('update');
                }
				else if($scope.resultCountShow == $scope.productIds.length){ //Mustakeem
					$scope.checkout('update');
				}
								
            };

            $scope.hideCartItem = function(product) {
                var productId = parseInt(product.product_id, 10);
                return $scope.productIds.indexOf(product.product_id) >= 0 ? true : false;
            };

            checkoutSuccessCallback = function(flag) {
                if(flag == "update") {
                    //$scope.isCartUpdated = false;
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
                    if(value.price > 0 
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
                if(angular.isDefined(utility.getJStorageKey("productBasketCount_" + quoteId)) 
                    && utility.getJStorageKey("productBasketCount_" + quoteId)) {  
                    var productBasketCount = utility.getJStorageKey("productBasketCount_" + quoteId);                    
                    productBasketCount[productId] = parseInt(count, 10);                                        
                } else {
                    var productBasketCount = {};
                    productBasketCount[productId] = count;
                }
                utility.setJStorageKey("productBasketCount_" + quoteId, productBasketCount, 1);
            };
			
            $scope.checkout = function(flag) {
                if(flag == 'checkout') {

                    // Proceed to Checkout
                    $analytics.eventTrack($scope.selectedCity, {  category: "Proceed to Checkout" });
                    checkoutSuccessCallback('checkout')
                } else {

                    // Analytics to update cart
                    $analytics.eventTrack($scope.selectedCity, {  category: "Update Cart" });
                    var quoteId = utility.getJStorageKey("quoteId"),
                        products = buildProductObject();

                    toggleLoader(true);
                    productService.cartUpdateProduct(quoteId, products, $scope.productIds)
                        .then(function(data){
                            toggleLoader(false);
                            if(data.flag == 1 || data.flag == "1"){
                                if(angular.isUndefined(data.CartDetail) 
                                    || angular.isUndefined(data.CartDetail.items) 
                                    || !data.CartDetail.items.length) {
                                    utility.setJStorageKey("cartCounter" + $scope.quoteId, 0, 1);
                                    $location.url("/");
                                } else {
                                    var totalQty = productService.getCartItemCount(data.CartDetail.items);
                                    updateCartItemCounter(totalQty, true);
                                    utility.deleteJStorageKey("productBasketCount_" + quoteId);
                                    $scope.productIds = [];                           
                                    checkoutSuccessCallback(flag);    
                                    $scope.cartDetails = data.CartDetail;
                                    getYouSaveAmout();
                                }                   
                            }
							
							$scope.isCartUpdated = false; //Mustakeem
							angular.forEach(data.CartDetail.items, function(value, key) {
								$scope.soldOutItemNeg = value.webqty;
								$scope.itemToAdd = value.qty;
								if($scope.soldOutItemNeg <= 0 || $scope.itemToAdd > $scope.soldOutItemNeg){
									$scope.isCartUpdated = true;
								} else {
									if (!$scope.isCartUpdated){
										$scope.isCartUpdated = false;
									}
								}
							});
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

            $scope.truncateComma = function(num) {
                if(angular.isDefined(num)) {
                    num = parseFloat(num.replace(",", ""));
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
                $scope.selectedCity = city;
                utility.setJStorageKey("selectedCity", city, 1);
                utility.setJStorageKey("selectedCityId", location.id, 1);                
                utility.setJStorageKey("stateName", location.default_name, 1);
                utility.setJStorageKey("regionId", location.region_id, 1);
                // added for clearing cart - Pradeep
                if(location.id != utility.getJStorageKey("storeId")) {
                    utility.setJStorageKey("cartCounter" + $scope.quoteId, 0, 1);
                    utility.deleteJStorageKey("quoteId");
                    $scope.quoteId = null;
                    $scope.cartItemCount = 0;
                } 
                utility.setJStorageKey("storeId", location.id, 1);
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

            if($routeParams.specialDealLinkurl){
                $scope.columnSize = 11;
            } else if($scope.topOfferDealId){
                $scope.columnSize = 12;
            }
            else {
                 $scope.columnSize = 10;
            };

            // Page bottom touch event handler
            $scope.$on('endlessScroll:next', function() {
                if($scope.pagination.current_page < $scope.pagination.total_pages) {                    
                    $scope.pagination.current_page = $scope.pagination.current_page + 1;
                    if($scope.categoryId){
                       //getProductListByCategoryId();
                    }
                }                
            });

            $(window).on("scroll", function() {
                var scrollHeight = $(document).height(),
                    scrollPosition = $(window).height() + $(window).scrollTop();
                if ($scope.categoryId 
                        && $location.path().indexOf("product/") >= 0
                        && (scrollHeight - scrollPosition) / scrollHeight === 0) {
                    if($scope.pagination.current_page < $scope.pagination.total_pages) {                    
                        $scope.pagination.current_page = $scope.pagination.current_page + 1;
                        if($scope.categoryId){
                           getProductListByCategoryId();
                        }
                    }
                }
            });        

            angular.element(document).ready(function () {
                if(angular.isUndefined(utility.getJStorageKey("selectedCity"))
                    || !utility.getJStorageKey("selectedCity")) {
                    getCityList();                    
                } else {
                    $scope.selectedCity = utility.getJStorageKey("selectedCity");
                }
            });

        }
    ]);
});