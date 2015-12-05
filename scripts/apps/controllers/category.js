define(['app'], function(app) {
	app.controller('categoryController',  [
        '$scope', '$rootScope', '$location', '$q', '$timeout', '$routeParams', 'categoryService', 'productService', 'utility', 
        function($scope, $rootScope, $location, $q, $timeout, $routeParams, categoryService, productService, utility){
            $scope.categories = null;
            $scope.categoryIndex = -1;
            $scope.subCategoryIndex = -1;
            $scope.categoryName = null;
            $scope.urlImg = null;
            $scope.subCategoryList = null;
            $scope.showCategoryMenu = false;
            $scope.showSubCategoryMenu = false;
            $scope.subSubCategoryIndex = -1;
            $scope.preserveCategoryId = null;
            $scope.showMoreMenuOptions = false;
            $scope.showSearchBar = true;
            $scope.showSearchIcon = false;
            $scope.showMoreIcon = true;
            $scope.showMoreMenuOptions = false;
            $scope.showUserMenuOptions = false;            
            $scope.searchKeyword = "";
            $scope.moreCategoryIndex = -1;
            $scope.preserveMoreCategoryId = null;
            $scope.isUserLoggedIn = angular.isDefined(utility.getJStorageKey("userId")) && utility.getJStorageKey("userId") ? true : false;
            $scope.cartItems = [];
            $scope.cartItemCount = 0;
            $scope.categoryName = "Dynamic Name";
            $scope.bannerList = null;
            $scope.quoteId = angular.isDefined(utility.getJStorageKey("quoteId")) && utility.getJStorageKey("quoteId") ? utility.getJStorageKey("quoteId") : null;
            $scope.cityList = null;
            $scope.cityLocation = {};
            $scope.categoryImageUrl = null;
            $scope.myInterval = 5000;
            $scope.noWrapSlides = false;
            $scope.carouselIndex = 0;

            toggleLoader = function(flag) {
                $scope.displayLoader = flag;
            };  

            /*getBannerList = function() {
                if (utility.getJStorageKey("bannerList")) {
                    $scope.bannerList = utility.getJStorageKey("bannerList");
                } else {                    
                    categoryService.getBannerList()
                        .then(function(data){  
                            if(data.flag == 1) {                      
                                $scope.bannerList = data.banner;
                                utility.setJStorageKey("bannerList", $scope.bannerList, 1);
                            }
                        });
                }
            };*/            

            /*getMasterCategoryList = function() {
                if (utility.getJStorageKey("categories")) {
                    $scope.categories = utility.getJStorageKey("categories");
                    $scope.categories.sort(utility.dynamicSort("position"));
                    $scope.categoryImageUrl = utility.getJStorageKey("categoryImageUrl");
                } else {
                    categoryService.getCategoryList()
                        .then(function(data){
                            $scope.categories = data.Category.children[0].children; 
                            $scope.categories.sort(utility.dynamicSort("position"));
                            $scope.urlImg = data.urlImg; 
                            utility.setJStorageKey("categories", $scope.categories, 1);
                            $scope.categoryImageUrl = data.urlImg;
                            utility.setJStorageKey("categoryImageUrl", data.urlImg, 1);
                        });
                }
            };*/

            /*getOfferCategoryList = function() {
                if (utility.getJStorageKey("offerCategories")) {
                    $scope.offerCategories = utility.getJStorageKey("offerCategories");
                } else {
                    categoryService.getCategoryOfferList()
                        .then(function(data){
                            $scope.offerCategories = data.category;
                            utility.setJStorageKey("offerCategories", $scope.offerCategories, 1);
                        });
                }
            };*/

            /*getDealList = function() {
                if (utility.getJStorageKey("deals")) {
                    $scope.deals = utility.getJStorageKey("deals");
                } else {
                    categoryService.getDealList()
                        .then(function(data){
                            $scope.deals = data.deal_type; 
                            utility.setJStorageKey("deals", $scope.deals, 1);
                        });
                }
            };*/            

            bannerCallback = function(data) {
                if(data.flag == 1) {                      
                    $scope.bannerList = data.banner;
                    utility.setJStorageKey("bannerList", $scope.bannerList, 1);
                }
            };

            categoryCallback = function(data) {
                if(data.flag == 1) {
                    angular.forEach(data.Category.children, function(value, key) {
                        if(value.name == "Default Category") {
                            $scope.categories = value.children;                            
                        }                        
                    });
                    $scope.categories.sort(utility.dynamicSort("position"));
                    utility.setJStorageKey("categories", $scope.categories, 1);
                    $scope.urlImg = data.urlImg; 
                    $scope.categoryImageUrl = data.urlImg;
                    utility.setJStorageKey("categoryImageUrl", data.urlImg, 1);
                }
            };

            offerCallback = function(data) {
                if(data.flag == 1) {                      
                    $scope.offerCategories = data.category;
                    utility.setJStorageKey("offerCategories", $scope.offerCategories, 1);
                }
            };

            dealCallback = function(data) {
                if(data.flag == 1) {                      
                    $scope.deals = data.deal_type;
                    utility.setJStorageKey("deals", $scope.deals, 1);
                }
            };

            promiseCallback = function(data) {
                bannerCallback(data[0]);
                categoryCallback(data[1]);
                offerCallback(data[2]);
                dealCallback(data[3]);
                setCategoryOfferCount();
                toggleLoader(false);
            };

            getOfferCount = function(categoryId) {
                var offerCount = 0;
                if($scope.offerCategories.length) {
                    angular.forEach($scope.offerCategories, function(value, key) {
                        if(value.category_id == categoryId) {
                            offerCount = value.offercount;
                        }
                    });
                }
                return offerCount;
            };

            setCategoryOfferCount = function() {
                if($scope.categories.length) {
                    angular.forEach($scope.categories, function(value, key) {
                        value["offerCount"] = getOfferCount(value.category_id)
                    });
                }
            };

            if (utility.getJStorageKey("bannerList")
                && utility.getJStorageKey("categories")
                && utility.getJStorageKey("offerCategories")
                && utility.getJStorageKey("deals")) {
                    $scope.bannerList = utility.getJStorageKey("bannerList");
                    $scope.categories = utility.getJStorageKey("categories");
                    $scope.categories.sort(utility.dynamicSort("position"));
                    $scope.categoryImageUrl = utility.getJStorageKey("categoryImageUrl");
                    $scope.offerCategories = utility.getJStorageKey("offerCategories");
                    $scope.deals = utility.getJStorageKey("deals");
                    setCategoryOfferCount();
            } else {
                toggleLoader(true);
                $q.all([
                    categoryService.getBannerList(), 
                    categoryService.getCategoryList(), 
                    categoryService.getCategoryOfferList(), 
                    categoryService.getDealList()]).then(function(data){
                        promiseCallback(data);                    
                });
            }                        

            $scope.dealCategoryList = [];
            $scope.dealCategoryItemList = {};
            $scope.dealItems = null;
            $scope.activeDealCategory = "all";

            getDealItemList = function(data) {
                $scope.dealCategoryList = [];
                $scope.dealCategoryList.push({id: "all", label: "All"});
                
                //$scope.dealCategoryItemList["all"] = data["all"];
                //$scope.dealItems = data["all"];
                
                $scope.dealCategoryItemList["all"] = [];
                //angular.forEach(data.all, function(outerValue, outerKey) {
                    angular.forEach(data.all, function(value, key) {
                        $scope.dealCategoryItemList["all"].push(value);
                    });
                //});

                $scope.dealItems = $scope.dealCategoryItemList["all"];
                //angular.forEach(data.category, function(outerValue, outerKey) {
                    angular.forEach(data.category, function(value, key) {
                        //console.log(value);
                        if(value.is_active == "1") {
                            $scope.dealCategoryList.push({
                                id: value.category_id, 
                                label: value.name
                            });
                            $scope.dealCategoryItemList[value.category_id] = value.deals;
                        }                                        
                    });
                //});
            }

            getDealItemListByOffer = function(data) {
                $scope.dealCategoryList = [];
                $scope.dealCategoryList.push({id: "all", label: "All"});
                $scope.dealCategoryItemList["all"] = data["all"];                
                //$scope.activeDealCategory = $routeParams.dealCategoryId;
                $scope.dealItems = data["all"];
                angular.forEach(data.dealsCategory, function(value, key) {
                    $scope.dealCategoryList.push({
                        id: key, 
                        label: value.dealType
                    });
                    $scope.dealCategoryItemList[key] = value.deals;                                                           
                });
                //$scope.dealItems = $scope.dealCategoryItemList[$routeParams.dealCategoryId];
                //TODO: we have used all key for time being due to unavailability of real category id, will uncomment it
            };

            if ($routeParams.categoryId) {
                $scope.subCategoryList = categoryService.getSubCategoryList($scope.categories, $routeParams.categoryId);
                $scope.subCategoryList.sort(utility.dynamicSort("position"));
                console.log($scope.subCategoryList);
                $scope.categoryName = categoryService.getCategoryName($scope.categories, $routeParams.categoryId);
                $scope.columnSize = 10;
                $scope.showMoreIcon = false;
            } else if ($routeParams.dealId) {
                $scope.columnSize = 10;
                $scope.showMoreIcon = false;
                //$scope.categoryName = "Deal Name";
                toggleLoader(true);
                categoryService.getDealsByDealId($routeParams.dealId)
                    .then(function(data){  
                        if(data.flag == 1) {    
                            $scope.categoryName = angular.isDefined(data.dealcategory.name[0]) ? data.dealcategory.name[0] : "Deal";                  
                            getDealItemList(data.dealcategory);
                        }
                        toggleLoader(false);
                    });
            }  else if ($routeParams.dealCategoryId) {
                $scope.columnSize = 10;
                $scope.showMoreIcon = false;
                $scope.categoryName = categoryService.getCategoryName($scope.categories, $routeParams.dealCategoryId);
                toggleLoader(true);
                categoryService.getDealsByDealCategoryId($routeParams.dealCategoryId)
                    .then(function(data){      
                        if(data.flag == 1) {
                            getDealItemListByOffer(data.dealcategorylisting);
                        }
                        toggleLoader(false);                                  
                    });
            } else if($location.url() == "/hot-offers") {
                $scope.columnSize = 10;
                $scope.showMoreIcon = false;
                $scope.categoryName = "Hot Offers";
            }else{
                $scope.columnSize = 1;
            }            

            getCartItemDetails = function() {
                toggleLoader(true);
                productService.getCartItemDetails($scope.quoteId)
                    .then(function(data){ 
                        toggleLoader(false);             
                        $scope.cartDetails = data.CartDetail;                         
                        $scope.cartItemCount = productService.getCartItemCount($scope.cartDetails.items);             
                    });
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

            if($scope.quoteId){
                //getCartItemDetails(); 
                getBasketItemCounter();
            }

            $scope.getDealCategoryItemList = function(category) {
                $scope.activeDealCategory = category.id;
                $scope.dealItems = $scope.dealCategoryItemList[category.id];
            };

            $scope.routerChange = function(route, id) {
                route = angular.isDefined(id) ? route + ("/" + id) : route;
                $location.url(route);
            };

            $scope.navigateToProduct = function(route, itemId) {
                $location.url(route + "/deal/" + itemId);
            };
            
            $scope.toggleCategoryMenu = function() {
                $scope.showSubCategoryMenu = false;
                $scope.showCategoryMenu = $scope.showCategoryMenu ? false : true;
            };

            $scope.toggleSubCategoryMenu = function(categoryId) {                
                $scope.showCategoryMenu = false;
                $scope.showSubCategoryMenu = $scope.showSubCategoryMenu ? false : true;
                $scope.categoryName = categoryService.getCategoryName($scope.categories, categoryId);
                $scope.subCategories = categoryService.getSubCategoryList($scope.categories, categoryId);
                $scope.subCategories.sort(utility.dynamicSort("position"));
            };

            $scope.isMenuToggalable = function(category) {
                return angular.isDefined(category.children[0]) && category.children[0].children.length ? true : false
            };

            $scope.handleDrawerClick = function(category) {
                var isToggle = $scope.isMenuToggalable(category);
                if(isToggle) {
                    $scope.toggleSubSubCategory(category.category_id)
                } else {
                    $scope.routerChange('product', category.category_id);
                }
            };

            $scope.handleOfferCategoryClick = function(category) {
                var isToggle = $scope.isMenuToggalable(category);
                if(isToggle) {
                    $scope.showMoreCategory(category)
                } else {
                    $scope.routerChange('product', category.category_id);
                }
            };

            $scope.toggleSubSubCategory = function(categoryId){
                if($scope.subSubCategoryIndex == -1) {
                    $scope.subSubCategoryIndex = categoryId;
                    $scope.preserveCategoryId = categoryId;
                }else{
                    if($scope.preserveCategoryId == categoryId){
                        $scope.subSubCategoryIndex = -1;
                    }else{
                        $scope.subSubCategoryIndex = categoryId;
                    }                    
                }
            };
           
            $scope.renderChildrenCategory = function(childCategories) {
                var strCategory = "";

                angular.forEach(childCategories, function(value, key){
                    if(key <= 0){
                        strCategory+=value.name;
                    }
                    if(key < 0){
                        strCategory+=", ";
                    }
                });
                return strCategory;
                
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

            $scope.handleMenuCategoryOutsideClick = function() {
                $scope.showCategoryMenu = false;
            };

            $scope.handleSubMenuCategoryOutsideClick = function() {
                $scope.showSubCategoryMenu = false;
            };

            $scope.isSpecialCategory = function(categoryId) {
                return categoryService.isSpecialCategory(categoryId);
            };

            $scope.logout = function() {

            };

            $scope.changeSearchKeyword = function(model) {
                $scope.searchKeyword = model;
            };

            $scope.checkIfEnterKeyWasPressed = function($event) {
                var keyCode = $event.which || $event.keyCode;
                if (keyCode === 13 && $scope.searchKeyword.length >=3 ) {
                    $scope.handleSearchKeyEnter();
                }
            };

            $scope.handleSearchKeyEnter = function() {
                console.log("handleSearchKeyEnter");
                $location.url("product?keyword=" + $scope.searchKeyword)
            };
            
            $scope.showMoreCategory = function(category) {
                if($scope.moreCategoryIndex == -1) {
                    $scope.moreCategoryIndex = category.category_id;
                    $scope.preserveMoreCategoryId = category.category_id;
                }else{
                    if($scope.preserveMoreCategoryId == category.category_id){
                        $scope.moreCategoryIndex = -1;
                    }else{
                        $scope.moreCategoryIndex = category.category_id;
                    }                    
                }
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
                if(angular.isDefined(utility.getJStorageKey("cityList"))
                    && utility.getJStorageKey("cityList")) {
                    $scope.cityList = utility.getJStorageKey("cityList");
                    openCitySelectionModal();
                } else {                
                    utility.getCityList()
                        .then(function(data){
                            $scope.cityList = data.location;
                            utility.setJStorageKey("cityList", $scope.cityList, 1);
                            angular.forEach($scope.cityList, function(value, key) {
                                var city = value.city_name.toLowerCase();
                                $scope.cityLocation[city] = false;
                            });                            
                            console.log($scope.cityLocation);
                            openCitySelectionModal();
                        });
                }
            };

            $scope.editLocation = function() {
                getCityList();
            };

            hideCitySelectionModal = function() {
                $('#myModal').modal('hide');
            };

            $scope.setCityLocation = function(location) {
                console.log(location);
                var city = location.city_name.toLowerCase(),
                    cityId = location.id;

                angular.forEach($scope.cityLocation, function(value, key){
                    $scope.cityLocation[key] = false;
                });
                $scope.cityLocation[city] = true;
                utility.setJStorageKey("selectedCity", city, 1);
                utility.setJStorageKey("selectedCityId", location.id, 1);
                utility.setJStorageKey("storeId", location.storeid, 1);
                utility.setJStorageKey("stateName", location.default_name, 1);
                utility.setJStorageKey("regionId", location.region_id, 1);
                $scope.selectedCity = city;
                hideCitySelectionModal();
            };

            $scope.selectedCity = null;
            if(angular.isDefined(utility.getJStorageKey("selectedCity")) 
                && utility.getJStorageKey("selectedCity")) {
                $scope.selectedCity = utility.getJStorageKey("selectedCity");
            }            

            $scope.getCityImgSrc = function(location) {
                if(angular.isDefined(location)) {
                    var city = location.city_name.toLowerCase();
                    return $scope.cityLocation[city] ? 'selected.png' : '-unselected.png';
                } else {
                    return '-unselected.png';
                }                
            };

            $scope.navigateToCart = function() {
                if(angular.isDefined(utility.getJStorageKey("quoteId")) 
                    && utility.getJStorageKey("quoteId")
                    && $scope.cartItemCount) {
                    $location.url("cart" + "/" + utility.getJStorageKey("quoteId"));
                } else {
                    console.log("ELSE");
                }
            };

            $scope.handleBannerClick = function(banner) {
                var arrBanner = banner.linkurl.split('?'),
                    url = arrBanner[0],
                    queryParams = arrBanner[1].split('='),
                    queryKey = queryParams[0],
                    queryValue = queryParams[1];

                if(url == "dealproductlisting") {
                    $location.url("product/deal/" + queryValue)
                } else if(url == "search") {
                    $location.url("product/" + queryValue);
                } else if(url == "dealsbydealtype") {
                    $location.url("deals/" + queryValue);
                } else if(url == "offerbydealtype") {
                    $location.url("category/offers/" + queryValue);
                } else if(url == "productlistall") {
                    $location.url("product/" + queryValue);
                }
            };

            $scope.navigateToHotOffers = function() {
                $location.url("hot-offers");
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
