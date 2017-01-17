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
            $scope.onePageId = angular.isDefined($routeParams.onePageId) ? $routeParams.onePageId : null ;
            $scope.promoId = angular.isDefined($routeParams.promoId) ? $routeParams.promoId : null ;
            $scope.productId = angular.isDefined($routeParams.productId) ? $routeParams.productId : null ;
            $scope.coupon = $location.path();
            $scope.jStorageQuoteId = angular.isDefined(utility.getJStorageKey("quoteId")) && utility.getJStorageKey("quoteId") ? utility.getJStorageKey("quoteId") : null;
            $scope.quoteId = angular.isDefined($routeParams.quoteId) ? $routeParams.quoteId : null;
            $scope.parentCatId = angular.isDefined($routeParams.parentId) ? $routeParams.parentId : null ;
            /*if($routeParams.sku){
                $scope.specialDealName = angular.isDefined($routeParams.sku.split("@")[1]) ? $routeParams.sku.split("@")[1] : "Offer" ;
            }*/
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
            $scope.sku = angular.isDefined($routeParams.sku) ? $routeParams.sku : null ;
            $scope.productIds = [];
            $scope.isUserLoggedIn = angular.isDefined(utility.getJStorageKey("userId")) && utility.getJStorageKey("userId") ? true : false;
            $scope.productQty = {};
            $scope.isCartUpdated = false;
            $scope.couponDescripTogle = false;
            $scope.specialDealBanner = false;
            $scope.cityList = [{
                api_url:        "api/",
                city_name:      "Gurgaon",
                default_name:   "Haryana",
                id:             "1",
                region_id:      "487",
                storeid:        "1"
            }];
            $scope.cityLocation = {};
            $scope.coupontandc = false;
            $scope.pagination = {
                current_page : 1,
                total_pages : 0
            };
            /*if(utility.getJStorageKey("userId")){
                dataLayer = [{'userID' : utility.getJStorageKey("userId")}];
            }*/

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
                try{
                    $scope.productCategoryName = categoryService.getCategoryNameInDepth(utility.getJStorageKey("categories"), data.category_id);
                    console.log("Search Category Products " + data.category_id + " | " + $scope.productCategoryName); 
                    clevertap.event.push("Categories on L3 Level", {
                                "Device": "M-Site",
                                "Page": "CategoryName=" + $scope.productCategoryName,
                                "Page Name": $scope.categoryName,
                                "Category Id" : data.category_id
                            }); 
                    }catch(err){console.log("Error in Search Category Products fire.");}                              
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
                try{
                    clevertap.event.push("Categories on L3 Level", {
                            "Device": "M-Site",
                            "Page": "CategoryName=" + data.category_name,
                            "Page Name": data.category_name,
                            "Category Id" : data.category_id
                        });
                    console.log("clevertap Categories on L3 Level");
                    var l4catGtm = "UserId=" + utility.getJStorageKey("userId")+"/CategoryName=" + data.category_name;
                    dataLayer.push('send', { hitType: 'event', eventCategory: 'Mobile Category Interaction', 
                    eventAction: 'Category Page', eventLabel: l4catGtm}
                    );console.log(l4catGtm); console.log(dataLayer);
                }catch(err){console.log("Error in GTM fire.");}  
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
                } else if($scope.promoId || $scope.sku){
                    allProducts = angular.isDefined(data.Product.items) ? data.Product.items : [];
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
                        } else if($scope.promoId || $scope.sku){
                                value["quantity"] = 1;
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
                    } else if($scope.promoId || $scope.sku){
                        $scope.products.push.apply($scope.products, $scope.allProductCategoryList);
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
            
            getProductListByonePageId = function() { 
                toggleLoader(true);       
                productService.getProductListByonePageId($scope.onePageId)
                    .then(function(data){
                        $scope.categoryName = data.name;
                        $scope.imgUrl = data.imageUrl;
                        $scope.lnkUrl = data.linkUrl;
                        $scope.isProductLoaded = true;
                        $('body').css('overflow', 'auto');
                        toggleLoader(false);   
                    });                
            };

            $scope.onePageIdFunc = function(urls){
                var linkurl = urls.split("=")
                getProductListByDealId(linkurl[1]);
                $location.url("deals/" + linkurl[1]);
            };

            getProductListByPromoId = function() {       
                toggleLoader(true);       
                productService.getProductListByPromoId($scope.promoId, $scope.pagination.current_page)
                    .then(function(data){                        
                        groupAllProductByCategory(data);
                        $scope.isProductLoaded = true;
                        $('body').css('overflow', 'auto');                                     
                    });                
            };
    
            if($scope.dealId){
                getProductListByDealId();
            }
            
            if($scope.onePageId){
                getProductListByonePageId();
            }

            if($scope.promoId){
                getProductListByPromoId();
            }

            if($scope.categoryId){
                getAllProductListByCategoryId();
                var categories = utility.getJStorageKey("categories");
                if(categories && categories.length) {
                    $scope.categoryName = categoryService.getCategoryNameInDepth(utility.getJStorageKey("categories"), $scope.categoryId);
                }
            }

            getSpecialDealBySku = function() {
                toggleLoader(true);
                productService.getSpecialDealListBySku($scope.sku)
                    .then(function(data){
                        groupAllProductByCategory(data);
                        toggleLoader(false);
                        $scope.isProductLoaded = true;
                        $scope.specialDealBannerImg = data.dealPageImage;
                        $scope.specialDealName = data.dealName;
                    });
            }


            if($scope.sku){
                getSpecialDealBySku();
                /*$scope.SpecialDealName = categoryService.getSpecialDealName(utility.getJStorageKey("specialDeals"), $scope.sku);
                console.log($scope.SpecialDealName);*/
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
                utility.setJStorageKey("tempyouSaved", savedAmont, 1); 
                $scope.totalCartQty = qty;
            };

            var addShippingCharges = function() {
                if($scope.cartDetails.grand_total < 250 && $scope.cartDetails.shipping_address.shipping_amount <= 0) {
                    $scope.cartDetails.shipping_address.shipping_amount = 50;
                    $scope.cartDetails.grand_total = parseFloat($scope.cartDetails.grand_total) + parseFloat($scope.cartDetails.shipping_address.shipping_amount);
                }                
            };
            
            $scope.isCartLoaded = false; 
            $scope.isCartUpdatedPopup = false;
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
                            utility.setJStorageKey("tempCartCounter", data.TotalItem, 1); 
                            utility.setJStorageKey("tempCartVal", data.CartDetail.grand_total, 1); 
                            utility.setJStorageKey("tempShipVal", data.CartDetail.shipping_address.shipping_amount, 1);                         
                            addShippingCharges();
                            $scope.couponValue = (data.CartDetail.subtotal - data.CartDetail.subtotal_with_discount);
                            utility.setJStorageKey("tempcouponValue", $scope.couponValue, 1); 
                            if(data.CartDetail.coupon_code){
                                $scope.invalidCoupon = false;
                                $scope.invalidCouponBlank = false;
                                $scope.couponMessage = "";
                                $scope.isCouponCodeApplied = true;
                                $scope.couponCode = data.CartDetail.coupon_code;
                                $scope.couponAmount = data.CartDetail.you_save;
                                $scope.cartDetails.grand_total = data.CartDetail.grand_total;
                                $scope.couponModalShow = false;
                            }
                            getYouSaveAmout();
                            if(data.TotalItem == 0) {
                                utility.setJStorageKey("cartCounter" + $scope.quoteId, 0, 1);
                                $location.url("/");
                            } else {
                                utility.setJStorageKey("cartCounter" + $scope.quoteId, data.TotalItem, 1);
                            }
                            
                            angular.forEach($scope.cartDetails.items, function(value, key) {
                                if(value.qty > value.webqty){
                                    $scope.MaxAvailQty = value.qty;
                                    $scope.MaxAvailQtyPid = value.product_id;
                                    $scope.isCartUpdated = true;
                                }

                                $scope.soldOutItemNeg = parseInt(value.webqty, 10);
                                if($scope.soldOutItemNeg <= 0){
                                    $scope.isCartUpdated = true;
                                    $scope.isCartUpdatedPopup = true;
                                    
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
                try{
                    clevertap.event.push("View Cart", {
                            "Device": "M-Site",
                            "Subtotal": utility.getJStorageKey("tempCartVal"),
                            "Quantity": $scope.cartItemCount,
                            "Coupon Code" : utility.getJStorageKey("couponCode")
                        });
                    var QgtmCart ="UserId=" + utility.getJStorageKey("userId") + "/CartQty="+ $scope.cartItemCount;
                    dataLayer.push('send', { hitType: 'event', eventCategory: 'Mobile View Cart', 
                        eventAction: 'Cart Details', eventLabel: QgtmCart }
                        ); console.log("Cart Open");
                }catch(err){console.log("Error in GTM fire.");}
               
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

            $scope.addProductOneByOne = function(product,page) {
                // Tracking add to cart
                //$analytics.eventTrack($scope.selectedCity, {  category: "Add to Cart", label: ( product.productid + " - " + product.Name + " - " + product.quantity) });
                // code added by grocermax team for GTM
                try{ 
                var GtmpId = product.productid;
                var GtmQty = product.quantity;
                var GtmName = product.Name;
                if (GtmName === undefined || GtmName === null) {
                    GtmName = product.product_name;
                }
                var GtmPrice = product.Price;
                var GtmBrand = product.p_brand;
                clevertap.event.push("Add to Cart", {
                            "Device": "M-Site",
                            "Product Id": GtmpId,
                            "Page Name": page,
                            "Product Name" : GtmName,
                            "Qty Added to Cart" : GtmQty,
                        });
                
                var productgtm = "UserId=" + utility.getJStorageKey("userId") + "/productName=" + GtmName + "/prodcutId=" + GtmpId; 
                dataLayer.push('send', { hitType: 'event', eventCategory: 'Mobile Add to Cart', 
                                eventAction: page, eventLabel: productgtm});  console.log("add o cart");
                }catch(err){  console.log("Error in"); }
                
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
                            // handle quoteid if customer has switched to another platform and quoteid changed somehow
                            if(quoteId != data.QuoteId){
                                console.log(data.QuoteId);
                                utility.setJStorageKey("quoteId", data.QuoteId, 1);
                            }
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

            $scope.routerChange = function(route, id , name) {
                try{
                    clevertap.event.push("Product Detail View", {
                            "Device": "M-Site",
                            "Page": "/ProductName=" + name,
                            "Page Name": name
                            //"Category Id" : categoryId
                        });
                    var pddetailGtm = "UserId=" + utility.getJStorageKey("userId") + "/ProductName=" + name;
                    dataLayer.push('send', { hitType: 'event', eventCategory: 'Mobile Category Interaction', 
                        eventAction: 'Product Detail Page', eventLabel: pddetailGtm}
                        );console.log(pddetailGtm);console.log(dataLayer);
                }catch(err){console.log("Error in GTM fire.");}

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
                $scope.MaxAvailQty ="";
                $scope.MaxAvailQtyPid="";
                var productId = item.product_id;
                if((parseInt(item.qty) + 1) > item.webqty ){
                    $scope.MaxAvailQty = parseInt(item.qty) + 1;
                    $scope.MaxAvailQtyPid = productId;
                    return true;
                }else{
                    angular.forEach($scope.cartDetails.items, function(value, key) {
                        if(value[keyName] == productId && value.price > 0) {
                            value["qty"] = parseInt(value["qty"], 10) + 1;
                        }                    
                    });
                }
            };

            $scope.decreaseCartProductQuantity = function(item, keyName) {
                var productId = item.product_id;
                $scope.MaxAvailQty ="";
                $scope.MaxAvailQtyPid="";
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
                            //console.log("checkout 2");
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
                try{     
                    clevertap.event.push("Proceed to Checkout", {
                            "Device": "M-Site",
                            //"Page": "Cart Page",
                            "Page Name": "Cart Page",
                            "Coupon Code" : utility.getJStorageKey("couponCode"),
                            "Subtotal" : $scope.cartDetails.grand_total,
                            "Quantity" : $scope.cartItemCount
                        });
                    console.log("Proceed to Checkout");
                    var logintgtm = "CartQty=" + $scope.cartItemCount + "/subtotal=" + $scope.cartDetails.grand_total + "/UserId="+ utility.getJStorageKey("userId");
                    dataLayer.push('send', { hitType: 'event',  eventCategory: 'Mobile Proceed to checkout', 
                                    eventAction: 'Proceed Details', eventLabel: logintgtm}
                    );console.log("Proceed Details");
                }catch(err){console.log("Error in GTM fire.");}

                    checkoutSuccessCallback('checkout')
                } else {
                    // Analytics to update cart
                    $analytics.eventTrack($scope.selectedCity, {  category: "Update Cart" });
                try{ 
                    var logintgtm = "CartQty=" + $scope.cartItemCount + "/subtotal=" + $scope.cartDetails.grand_total + "/UserId="+ utility.getJStorageKey("userId");
                    dataLayer.push('send', { hitType: 'event',  eventCategory: 'Mobile Update Cart', 
                                    eventAction: 'Update Cart', eventLabel: logintgtm}
                    );console.log("Update Cart");
                }catch(err){console.log("Error in GTM fire.");}

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
                                    $scope.couponValue = (data.CartDetail.subtotal - data.CartDetail.subtotal_with_discount);
                                    utility.setJStorageKey("tempCartCounter", data.TotalItem, 1); 
                                    utility.setJStorageKey("tempCartVal", data.CartDetail.grand_total, 1); 
                                    utility.setJStorageKey("tempcouponValue", $scope.couponValue, 1);
                                    utility.setJStorageKey("tempShipVal", data.CartDetail.shipping_address.shipping_amount, 1);
                                    try{
                                        clevertap.event.push("Update Cart", {
                                            "Device": "M-Site",
                                            //"Page": "Cart Page",
                                            "Page Name": "Cart Page",
                                            "Coupon Code" : data.CartDetail.coupon_code,
                                            "Subtotal" : data.CartDetail.grand_total,
                                            "Quantity" : totalQty
                                        });
                                        console.log("Clever Tap Update Cart");
                                    }catch(err){console.log("Error in Clever Tap fire.");}
                                    if(data.CartDetail.coupon_code){
                                        $scope.invalidCoupon = false;
                                        $scope.invalidCouponBlank = false;
                                        $scope.couponMessage = "";
                                        $scope.isCouponCodeApplied = true;
                                        $scope.couponCode = data.CartDetail.coupon_code;
                                        $scope.couponAmount = data.CartDetail.you_save;
                                        $scope.cartDetails.grand_total = data.CartDetail.grand_total;
                                        console.log($scope.cartDetails.grand_total);
                                        $scope.couponModalShow = false;
                                    }else{
                                        $scope.invalidCoupon = true;
                                        $scope.invalidCouponBlank = true;
                                        $scope.isCouponCodeApplied = false;
                                        $scope.couponCode = data.CartDetail.coupon_code;
                                        $scope.couponAmount = data.CartDetail.you_save;
                                        $scope.cartDetails.grand_total = data.CartDetail.grand_total;
                                        $scope.couponModalShow = false;
                                    }
                                    if (!$scope.isCartUpdated && !$scope.isCartUpdatedPopup){
                                        $scope.isCartUpdated = false;
                                        $scope.isCartUpdatedPopup = false;
                                    }
                                    getYouSaveAmout();
                                }                   
                            }
                            
                            $scope.isCartUpdated = false; //Mustakeem
                            $scope.isCartUpdatedPopup = false; //Mustakeem
                            angular.forEach(data.CartDetail.items, function(value, key) {
                                $scope.soldOutItemNeg = value.webqty;
                                $scope.itemToAdd = value.qty;
                                if(value.qty > value.webqty){
                                    $scope.MaxAvailQty = value.qty;
                                    $scope.MaxAvailQtyPid = value.product_id;
                                    $scope.isCartUpdated = true;
                                }
                                if($scope.soldOutItemNeg <= 0){
                                    $scope.isCartUpdated = true;
                                    $scope.isCartUpdatedPopup = true;
                                } else {
                                    if (!$scope.isCartUpdated && !$scope.isCartUpdatedPopup){
                                        $scope.isCartUpdated = false;
                                        $scope.isCartUpdatedPopup = false;
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
            
            $scope.couponTnC = function(){
                $scope.coupontandc = !$scope.coupontandc;
            }
            
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
                toggleLoader(true);
                if(angular.isDefined(utility.getJStorageKey("cityList"))
                    && utility.getJStorageKey("cityList")) {
                    $scope.cityList = utility.getJStorageKey("cityList");
                    //openCitySelectionModal();
                } /*else {                
                    utility.getCityList()
                        .then(function(data){
                            $scope.cityList = data.location;
                            utility.setJStorageKey("cityList", $scope.cityList, 1);
                            angular.forEach($scope.cityList, function(value, key) {
                                var city = value.city_name.toLowerCase();
                                $scope.cityLocation[city] = false;
                            });                            
                            openCitySelectionModal();
                        });
                }*/
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
            
            //$scope.couponlistofcode = {};
            couponList = function(){
                toggleLoader(true);
                productService.getCouponCodeList()
                    .then(function(data){
                        if(data.flag == 1 || data.flag == "1"){
                            $scope.couponlistofcode = data.coupon;
                            utility.setJStorageKey("codeList" + $scope.couponlistofcode, 1);
                            toggleLoader(false);
                        }
                    });
            };
            
            $scope.couponModalShow = false;
            $scope.navigateToCoupon = function() {
                if(utility.getJStorageKey("userId")){
                     $scope.couponModalShow = !$scope.couponModalShow;
                    //$location.url("coupon");
                    couponList();
                }else{
                   $location.url("user/login?isReferrer=coupon");
                }
            };
            
            $scope.isCouponCodeApplied = false;
            $scope.couponAmount = 0.00;
            $scope.couponCode = null;
            //$scope.couponDescription = null;
            
            $scope.applyCouponCode = function(couponCode, index) {
                toggleLoader(true);
                productService.applyCoupon(utility.getJStorageKey("userId"), utility.getJStorageKey("quoteId"), couponCode)
                    .then(function(data){
                        toggleLoader(false);
                        $scope.couponLi = index;
                        if(data.flag == 1) {
                            $scope.couponCode = couponCode;
                            utility.setJStorageKey("couponCode", couponCode, 1);
                            //$scope.couponDescription = coupondescription;
                            $scope.invalidCoupon = false;
                            $scope.invalidCouponBlank = false;
                            $scope.couponMessage = "";
                            $scope.isCouponCodeApplied = true;
                            $scope.couponAmount = data.CartDetails.you_save;
                            $scope.cartDetails.grand_total = data.CartDetails.grand_total;
                            $scope.couponValue = (data.CartDetail.subtotal - data.CartDetail.subtotal_with_discount);

                            utility.setJStorageKey("tempcouponValue", $scope.couponValue, 1); 
                            $scope.couponModalShow = false;
                            try{  

                                clevertap.event.push("Apply Coupon", {
                                    "Device": "M-Site",
                                    //"Page": "Cart Page",
                                    "Page Name": "Cart Page",
                                    "Coupon Code" : couponCode,
                                    "Subtotal" : $scope.cartDetails.grand_total,
                                    "Quantity" : $scope.cartItemCount
                                });
                                console.log("Apply Coupon");   
                                var logintgtm = "CouponCode=" + couponCode + "/CartQty=" + $scope.cartItemCount + "/subtotal=" + $scope.cartDetails.grand_total + "/UserId="+ utility.getJStorageKey("userId");
                                dataLayer.push('send', { hitType: 'event',  eventCategory: 'Mobile Apply Coupon', 
                                    eventAction: 'Coupon Code', eventLabel: logintgtm}
                                );console.log("Apply Coupon"); console.log(dataLayer)
                            }catch(err){console.log("Error in GTM fire.");}
                        }                       
                        else {
                            $scope.invalidCoupon = true;
                            $scope.couponMessage = data.Result;

							utility.setJStorageKey("tempcouponValue", $scope.couponValue, 1);
                            utility.setJStorageKey("tempCartVal", $scope.cartDetails.grand_total, 1);  
                            $scope.couponModalShow = false;
                        } 						



                            

                                            
                    });
            };

            $scope.removeCouponCode = function(couponCode, index){
               toggleLoader(true);
               productService.removeCoupon(utility.getJStorageKey("userId"), utility.getJStorageKey("quoteId"), couponCode)
                    .then(function(data){
                        toggleLoader(false);
                        $scope.couponLi = index;
                        if(data.flag == 1) {
                            $scope.couponCode = null;
                            //$scope.couponDescription = null;
                            $scope.couponModalShow = false;
                            $scope.invalidCoupon = true;
                            $scope.invalidCouponBlank = true;
                            $scope.couponMessage = "";
                            $scope.isCouponCodeApplied = false;
                            $scope.couponAmount = data.CartDetails.you_save;
                            $scope.couponValue = (data.CartDetail.subtotal - data.CartDetail.subtotal_with_discount);

                            utility.setJStorageKey("tempcouponValue", $scope.couponValue, 1); 
                            utility.deleteJStorageKey("couponCode");
                            $scope.cartDetails.grand_total = data.CartDetails.grand_total;
                            try{  
                                clevertap.event.push("Remove Coupon", {
                                    "Device": "M-Site",
                                    //"Page": "Cart Page",
                                    "Page Name": "Cart Page",
                                    "Coupon Code" : couponCode,
                                    "Subtotal" : $scope.cartDetails.grand_total,
                                    "Quantity" : $scope.cartItemCount
                                });
                                console.log("Remove Coupon");   
                                var logintgtm = "CouponCode=" + couponCode + "/CartQty=" + $scope.cartItemCount + "/SubTotal=" + $scope.cartDetails.grand_total + "/UserId="+ utility.getJStorageKey("userId");
                                dataLayer.push('send', { hitType: 'event',  eventCategory: 'Mobile Remove Coupon', 
                                    eventAction: 'Coupon Code', eventLabel: logintgtm}
                                );console.log("Remove Coupon"); console.log(dataLayer)
                            }catch(err){console.log("Error in GTM fire.");}

                            $scope.cartDetails.grand_total = data.CartDetails.grand_total;
                            utility.setJStorageKey("tempcouponValue", $scope.couponValue, 1); 
                            utility.setJStorageKey("tempCartVal", $scope.cartDetails.grand_total, 1);  

                        }                       
                        else {
                            $scope.invalidCoupon = false;
                            $scope.couponMessage = data.Result;
                        }                      
                    });
            }
            
            if($scope.sku){
                $scope.specialDealBanner = true;
                $scope.columnSize = 11;
            } else if($scope.topOfferDealId){
                $scope.columnSize = 12;
            } else if ($scope.promoId){
                $scope.columnSize = 13;
            } else if($scope.coupon == "/coupon"){
                $scope.columnSize = 14;
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

            // $(window).on("scroll", function() {
            //     var scrollHeight = $(document).height(),
            //         scrollPosition = $(window).height() + $(window).scrollTop();
            //     if ($scope.categoryId 
            //             && $location.path().indexOf("product/") >= 0
            //             && (scrollHeight - scrollPosition) / scrollHeight === 0) {
            //         if($scope.pagination.current_page < $scope.pagination.total_pages) {                    
            //             $scope.pagination.current_page = $scope.pagination.current_page + 1;
            //             if($scope.categoryId){
            //                getProductListByCategoryId();
            //             }
            //         }
            //     }
            // });        

            angular.element(document).ready(function () {
                if(angular.isUndefined(utility.getJStorageKey("selectedCity"))
                    || !utility.getJStorageKey("selectedCity")) {
                    getCityList();

                    $timeout(function() {
                        $("#e1").select2();                        
                    }, 2000);
                } else {
                    $scope.selectedCity = utility.getJStorageKey("selectedCity");
                }
            });

        }
    ]);
});
