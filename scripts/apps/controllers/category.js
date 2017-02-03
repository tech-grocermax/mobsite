define(['app'], function(app) {
	app.controller('categoryController',  [
        '$scope', '$rootScope', '$location', '$q', '$timeout', '$routeParams', 'categoryService', 'productService', 'utility', '$analytics',
        function($scope, $rootScope, $location, $q, $timeout, $routeParams, categoryService, productService, utility, $analytics){

            var isCategoryOffer = !!($location.path().indexOf("/category/offer") !== -1);
            var isDrawerOpen = false;
            // opening category L2 page directly show error if homepage api not loaded, use this var to delay rendering till homepage api loads
            var isCategoryLoaded = true;
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
			$scope.trendlist = [];
            $scope.cartItemCount = 0;
            $scope.grandTotal = 0;
            $scope.categoryName = "";
            $scope.bannerList = null;
            $scope.quoteId = angular.isDefined(utility.getJStorageKey("quoteId")) && utility.getJStorageKey("quoteId") ? utility.getJStorageKey("quoteId") : null;
            //$scope.cityList = null;
			//$scope.SpecialDealName = "";
			//$scope.specialDealItemList = {};
            //$scope.cityList = null;
            /*if(utility.getJStorageKey("userId")){
                dataLayer = [{'userID' : utility.getJStorageKey("userId")}];
            }*/

            $scope.cityList = [{
				api_url: 		"api/",
				city_name:		"Gurgaon",
				default_name:	"Haryana",
				id:				"1",
				region_id:		"487",
				storeid:		"1"
			}];
			$scope.cityLocation = {};
            $scope.categoryImageUrl = null;
            $scope.myInterval = 5000;
            $scope.noWrapSlides = false;
            $scope.carouselIndex = 0;
			$scope.modalHide = false;
            $scope.categorybannerlist ={};
			
			try{
                var GtmUser = "UserId=" + utility.getJStorageKey("userId");
                clevertap.event.push("Mobile Home Page View", {
                    "Device": "M-Site",
                    "Page": "Home Page"
                });
               
                dataLayer.push('send', { hitType: 'event', eventCategory: 'Mobile Home Page View', 
                        eventAction: 'Page Open', eventLabel: GtmUser}
                        );
            }catch(err){console.log("Error in GTM fire.");}
            $scope.pageRoute = {
                "faq": false,
                "contact": false,
                "payment": false,
                "term": false,
                "about": false
            };

            $scope.pageName = $routeParams.pageName;
            if($scope.pageName) {
                $scope.showSearchBar = false;
                $scope.columnSize = 1;                
                $scope.showSearchIcon = true;
                $scope.showMoreIcon = false;                
                $scope.pageRoute[$scope.pageName] = true;
            }

            $scope.toggleSearchSection = function() {
                $scope.showSearchBar = $scope.showSearchBar ? false : true;
            };         

            toggleLoader = function(flag) {
                $scope.displayLoader = flag;
            };                        

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
			
			specialDealCallback = function(data){
				if(data.flag == 1){
					$scope.specialdeals = data.specialdeal;
					utility.setJStorageKey("specialDeals", $scope.specialdeals, 1);
				}
			};
			
			trendingSearchCallback = function(data){
				if(data.flag == 1){
					//$scope.trendlist = data.trending.Result.data;
					angular.forEach(data.trending.Result.data, function(value, key){
						$scope.trendlist.push(value.name1);				
					});
					utility.setJStorageKey("trendingList", $scope.trendlist, 1);
				}
			};

            promiseCallback = function(data) {
                bannerCallback(data[0]);
                categoryCallback(data[0]);
                offerCallback(data[0]);
                dealCallback(data[0]);
                specialDealCallback(data[0]);
				trendingSearchCallback(data[0]);
				/*bannerCallback(data[0]);
                categoryCallback(data[1]);
                offerCallback(data[2]);
                dealCallback(data[3]);*/
                setCategoryOfferCount();
                toggleLoader(false);
                isCategoryLoaded = true;
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
                && utility.getJStorageKey("deals")
				&& utility.getJStorageKey("specialDeals")
				&& utility.getJStorageKey("trendingList")) {
                    $scope.bannerList = utility.getJStorageKey("bannerList");
                    $scope.categories = utility.getJStorageKey("categories");
                    $scope.categories.sort(utility.dynamicSort("position"));
                    $scope.categoryImageUrl = utility.getJStorageKey("categoryImageUrl");
                    $scope.offerCategories = utility.getJStorageKey("offerCategories");
                    $scope.deals = utility.getJStorageKey("deals");
                    $scope.specialdeals = utility.getJStorageKey("specialDeals");
                    $scope.trendlist = utility.getJStorageKey("trendingList");
                    setCategoryOfferCount();
            } else {
                toggleLoader(true);
                isCategoryLoaded = false;
                $q.all([
                    /*categoryService.getBannerList(), 
                    categoryService.getCategoryList(), 
                    categoryService.getCategoryOfferList(), 
                    categoryService.getDealList(),*/
					categoryService.getHomePageList()
					]).then(function(data){
                        promiseCallback(data);                    
                });
            }                        

            $scope.dealCategoryList = [];
            $scope.dealCategoryItemList = {};
            $scope.dealItems = null;
            $scope.activeDealCategory = "all";
            $scope.activeDealCategoryTab = "all";

            $rootScope.selectedDealCategoryId = angular.isDefined($rootScope.selectedDealCategoryId) && $rootScope.selectedDealCategoryId ? $rootScope.selectedDealCategoryId : null;

            getDealItemList = function(data) {

                var activeDealCategoryLabel = "";
                $scope.dealCategoryList = [];

                if(data.all.length) {
                    $scope.dealCategoryList.push({id: "all", label: "All"});
                    $scope.dealCategoryItemList["all"] = [];
                    angular.forEach(data.all, function(value, key) {
                        $scope.dealCategoryItemList["all"].push(value);
                    });
                    $scope.dealItems = $scope.dealCategoryItemList["all"];   
                }
                
                angular.forEach(data.category, function(value, key) {
                    if(value.is_active == "1") {
                        $scope.dealCategoryList.push({
                            id: value.category_id, 
                            label: value.name
                        });
                        $scope.dealCategoryItemList[value.category_id] = value.deals;
                        if($rootScope.selectedDealCategoryId 
                            && $rootScope.selectedDealCategoryId == value.category_id) {
                            $scope.activeDealCategory = value.category_id;
                            activeDealCategoryLabel =  value.name;
                            $scope.dealItems = $scope.dealCategoryItemList[value.category_id];
                        } else if(key == 0) {
                            $scope.activeDealCategory = value.category_id;
                            activeDealCategoryLabel =  value.name;
                            $scope.dealItems = $scope.dealCategoryItemList[value.category_id];
                        }
                    }               
                });
                var gaCategoryName = isCategoryOffer ? 'Category Deals': 'Deal Category L2';
                $analytics.eventTrack($scope.selectedCity, {  category: gaCategoryName, label: ( $scope.categoryName + " - " + activeDealCategoryLabel)  });
            };

            $rootScope.selectedOfferCategoryId = angular.isDefined($rootScope.selectedOfferCategoryId) && $rootScope.selectedOfferCategoryId ? $rootScope.selectedOfferCategoryId : null;
            getDealItemListByOffer = function(data) {
                $scope.dealCategoryList = [];
                $scope.dealCategoryList.push({id: "all", label: "All"});
                $scope.dealCategoryItemList["all"] = data["all"];                
                $scope.activeDealCategory = $routeParams.dealCategoryId;
                $scope.dealItems = data["all"];

                var activeDealCategoryLabel = "";
                angular.forEach(data.dealsCategory, function(value, key) {
                    if($rootScope.selectedOfferCategoryId 
                        && $rootScope.selectedOfferCategoryId == key) {
                        $scope.activeDealCategory = key;
                        $scope.dealItems = value.deals;
                        activeDealCategoryLabel = value.dealType;
                    }  else if(key == 0) {
                        $scope.activeDealCategory = key;
                        $scope.dealItems = value.deals;
                        activeDealCategoryLabel = value.dealType;
                    }
                    $scope.dealCategoryList.push({
                        id: key, 
                        label: value.dealType
                    });
                    $scope.dealCategoryItemList[key] = value.deals;                                                           
                });
                var gaCategoryName = isCategoryOffer ? 'Category Deals': 'Deal Category L2';
                $analytics.eventTrack($scope.selectedCity, {  category: gaCategoryName, label: ( $scope.categoryName + " - " + activeDealCategoryLabel)  });
                //$scope.dealItems = $scope.dealCategoryItemList[$routeParams.dealCategoryId];
                //TODO: we have used all key for time being due to unavailability of real category id, will uncomment it
            };

            if ($routeParams.categoryId) {
                var loadL2CatPage = function(){
                    if(isCategoryLoaded){
                        $scope.subCategoryList = categoryService.getSubCategoryList($scope.categories, $routeParams.categoryId);
                        $scope.subCategoryList.sort(utility.dynamicSort("position"));
                        $scope.categoryName = categoryService.getCategoryName($scope.categories, $routeParams.categoryId);
                        $scope.columnSize = 10;
                        categoryService.getSubCategoryBanner($routeParams.categoryId)
                            .then(function(data){
                               $scope.categorybannerlist = data.subcategorybanner;
                            });
                        angular.forEach($scope.subCategoryList, function(value, key) {
                            $scope.offerlistId = value.parent_id;
                        });
                        $scope.showMoreIcon = false;
                    }else{
                        console.log('delayed by 1 sec');
                        setTimeout(loadL2CatPage, 1000);    // delay for 1 second
                    }
                }
                loadL2CatPage();
            } else if ($routeParams.dealId) {
                $scope.columnSize = 10;
                $scope.showMoreIcon = false;
                toggleLoader(true);
                categoryService.getDealsByDealId($routeParams.dealId)
                    .then(function(data){
                        if(data.flag == 1) {    
                            $scope.categoryName = angular.isDefined(data.dealcategory.name[0]) ? data.dealcategory.name[0] : "Deal";                  
                            getDealItemList(data.dealcategory);
                        }
                        toggleLoader(false);
                    });					
            /*} else if ($routeParams.specialDealSku) {
                $scope.columnSize = 11;
                $scope.showMoreIcon = false;
                toggleLoader(true);
				$scope.SpecialDealName = categoryService.getSpecialDealName($scope.specialdeals, $routeParams.specialDealSku);
				categoryService.getSpecialDealsBySku($routeParams.specialDealSku)
                    .then(function(data){
                        if(data.flag == 1) {
							$scope.specialDealItemList = data.Product.items;
                        }
                        toggleLoader(false);
                    });*/
            }  else if ($routeParams.dealCategoryId) {
                $scope.columnSize = 10;
                $scope.showMoreIcon = false;
                $scope.categoryName = categoryService.getCategoryName($scope.categories, $routeParams.dealCategoryId);
                toggleLoader(true);
                categoryService.getDealsByDealCategoryId($routeParams.dealCategoryId)
                    .then(function(data){     
                        //if(data.flag == 1) {

                            getDealItemListByOffer(data.dealcategory);
                        //}
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
                        $scope.grandTotal = data.CartDetail.subtotal; 
                                  
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
                getBasketItemCounter();
            }

            $scope.getDealCategoryItemList = function(category) {
                
                // Track the event

                var gaCategoryName = isCategoryOffer ? 'Category Deals': 'Deal Category L2';
                $analytics.eventTrack($scope.selectedCity, {  category: gaCategoryName, label: ( $scope.categoryName + " - " + category.label)  });

                $rootScope.selectedDealCategoryId = category.id;
                $rootScope.selectedOfferCategoryId = category.id;

                $scope.activeDealCategory = category.id;
                $scope.activeDealCategoryTab = category.id;
                $scope.dealItems = $scope.dealCategoryItemList[category.id];
            };

            $scope.routerChange = function(route, id, name) {
                if(route == 'category'){
                    try{
                        clevertap.event.push("Category Interaction", {
                            "Device": "M-Site",
                            //"Page": "CategoryName=" + name,
                            "Category Name": name
                        });
                        
                console.log("Mobile Home Page category with new userId");
                        var catclGtm = "UserId=" + utility.getJStorageKey("userId")+"/CategoryName=" + name;
                        dataLayer.push('send', { hitType: 'event', eventCategory: 'Mobile Category Interaction', 
                        eventAction: 'Category Page', eventLabel: catclGtm}
                        );console.log(catclGtm); console.log(dataLayer);
                    }catch(err){console.log("Error in GTM fire.");}  
                }

                if(route == 'deals'){
                    try{
                        
                        if(!name){
                            clevertap.event.push("Drawer Activity", {
                                "Device": "M-Site",
                                "Action Performed" : "Deal Click"
                            });
                             console.log(" deal first " + route + " --- " + name);
                        }else{
                            clevertap.event.push("Banner Click", {
                                "Device": "M-Site",
                                //"Page": "Deal=" + name,
                                "Page Name": name,
                                "Banner Name":name
                            });
                             console.log(" deal second " + route + " --- " + name);
                        }
                        console.log(" deal rooo " + route + " --- " + name);
                        var dealclGtm = "UserId=" + utility.getJStorageKey("userId")+"/Deal=" + name;
                        dataLayer.push('send', { hitType: 'event', eventCategory: 'Mobile Banner Click', 
                        eventAction: 'Deal Page', eventLabel: dealclGtm}
                        );console.log(dealclGtm); console.log(dataLayer);
                    }catch(err){console.log("Error in GTM fire."+ err);} 
                }
                route = angular.isDefined(id) ? route + ("/" + id) : route;
                if(isDrawerOpen) {
                    $analytics.eventTrack($scope.selectedCity, {  category: "Close Drawer"});
                    isDrawerOpen = false;
                }
                
                $location.url(route);
            };

            $scope.navigateToProduct = function(route, itemId) {
                $location.url(route + "/deal/" + itemId);
            };
            
            $scope.toggleCategoryMenu = function() {
                try{
                    clevertap.event.push("Drawer Activity", {
                            "Device": "M-Site",
                            //"Category Name" : $scope.categoryName
                            "Action Performed" : "Drawer Click"
                        });
                    //console.log("Drawer Activity clevertap fire 11 " + $scope.categoryName);
                    var draActGtm = "UserId=" + utility.getJStorageKey("userId");
                    dataLayer.push('send', { hitType: 'event', eventCategory: 'Mobile - Drawer Activity', 
                        eventAction: 'Page Name', eventLabel: draActGtm}
                        );
                }catch(err){console.log("Error in GTM fire.");}
                $scope.showSubCategoryMenu = false;
                $scope.showCategoryMenu = $scope.showCategoryMenu ? false : true;

                isDrawerOpen = true;
                $analytics.eventTrack($scope.selectedCity, {  category: "Open Drawer"});

                $('body').css('overflow', 'hidden');
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
                try{
                    clevertap.event.push("Drawer Activity", {
                            "Device": "M-Site",
                            //"Category Name" : $scope.categoryName,
                            //"Category Id" : category.category_id
                            "Action Performed" : "Category Click"
                        });
                        console.log("Drawer Activity clevertap fire 12." + $scope.categoryName);
                    }catch(err){console.log("Error in clevertap fire.");}
            };

            $scope.handleOfferCategoryClick = function(category) {
                try{
                    clevertap.event.push("Category Interaction", {
                            "Device": "M-Site",
                            //"Page": "CategoryName=" + category.name,
                            "Category Name": category.name
                        });
                    console.log("clevertap Categories on L2 Level");
                    var gtmcatname ="UserId=" + utility.getJStorageKey("userId")+"/CategoryName=" + category.name;
                    dataLayer.push('send', { hitType: 'event', eventCategory: 'Mobile Category Interaction', 
                        eventAction: 'Category Page', eventLabel: gtmcatname}
                        );console.log(gtmcatname);console.log(dataLayer);
                }catch(err){console.log("Error in GTM fire.");}

                var isToggle = $scope.isMenuToggalable(category); 

                if(isToggle) {
                    $scope.showMoreCategory(category)
                } else {
                    $scope.routerChange('product', category.category_id);
                }
            };

            $scope.handleSpecailDealClick = function(specialDeal) {
                $scope.routerChange('specialDeal', specialDeal.linkurl);
            }

            $scope.handleTopOfferClick = function(offerlistId,categoryName) {
                try{
                    clevertap.event.push("Category Interaction", {
                            "Device": "M-Site",
                            //"Page": "CategoryName=" + categoryName,
                            "Category Name": "Top Offers" //categoryName,
                            //"Category Id" : categoryId
                        });
                    console.log("clevertap Categories Top Offers" + offerlistId);
                    var gtmcofferatname ="UserId=" + utility.getJStorageKey("userId") + "/CategoryName=" + categoryName;
                    dataLayer.push('send', { hitType: 'event', eventCategory: 'Mobile Category Interaction', 
                        eventAction: 'Category - Top Offers', eventLabel: gtmcofferatname}
                        );console.log(gtmcofferatname); console.log(dataLayer);
                }catch(err){console.log("Error in GTM fire.");}
                
                $scope.routerChange('category/offers', offerlistId);
            }

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
                $('body').css('overflow', 'auto');
                if(isDrawerOpen) {
                    $analytics.eventTrack($scope.selectedCity, {  category: "Close Drawer"});
                    isDrawerOpen = false;
                }
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
                try{
                    clevertap.event.push("Search", {
                            "Device": "M-Site",
                            //"User Id": utility.getJStorageKey("userId"),
                            "Keyword": $scope.searchKeyword
                        });
                    console.log("clevertap search on Home Page");
                    var gtmcsearcname ="UserId=" + utility.getJStorageKey("userId")+"/Keyword=" + $scope.searchKeyword;
                    dataLayer.push('send', { hitType: 'event', eventCategory: 'Mobile Category Interaction', 
                        eventAction: 'Search', eventLabel: gtmcsearcname}
                        );console.log(gtmcsearcname); console.log(dataLayer);
                    }catch(err){console.log("Error in GTM fire.");}
				var addItemTrendlist = $scope.trendlist.indexOf($scope.searchKeyword);
				if (addItemTrendlist < 0){
					$scope.trendlist.push($scope.searchKeyword);
					utility.setJStorageKey("trendingList", $scope.trendlist, 1);					
				}
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

            /*openCitySelectionModal = function() {
                $timeout(function(){
                    $('#myModal').modal({
                        backdrop: false,
                        keyboard: false,
                        show: true
                    });
                }, 1000);
            };*/

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

           /* $scope.editLocation = function() {
                getCityList();
            };*/

            hideCitySelectionModal = function() {
                $('#myModal').modal('hide');
            };

            $scope.setCityLocation = function(location) {
                var city = location.city_name.toLowerCase(),
                    cityId = location.id;

                /*angular.forEach($scope.cityLocation, function(value, key){
                    $scope.cityLocation[key] = false;
                });*/
                $scope.cityLocation[city] = true;
                $scope.selectedCity = city;
                utility.setJStorageKey("selectedCity", city, 1);
                utility.setJStorageKey("selectedCityId", location.id, 1);                
                utility.setJStorageKey("stateName", location.default_name, 1);
                utility.setJStorageKey("regionId", location.region_id, 1);
                // added for clearing cart - Pradeep
                if(location.storeid != utility.getJStorageKey("storeId")) {
                    utility.setJStorageKey("cartCounter" + $scope.quoteId, 0, 1);
                    utility.deleteJStorageKey("quoteId");
                    $scope.quoteId = null;
                    $scope.cartItemCount = 0;
                } 
                utility.setJStorageKey("storeId", location.storeid, 1);
                hideCitySelectionModal();
                toggleLoader(false);
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
                try{ 
                     var subT = utility.getJStorageKey("tempCartVal");
                    clevertap.event.push("View Cart", {
                            "Device": "M-Site",
                            "Subtotal": parseFloat($scope.grandTotal).toFixed(2),
                            "Quantity": $scope.cartItemCount,
                            "Coupon Code" : utility.getJStorageKey("couponCode")
                        });
                    console.log("clevertap view cart value " + utility.getJStorageKey("couponCode"));
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

            $scope.handleBannerClick = function(banner, name) {
                try{
                    if(name == 'category'){
                        clevertap.event.push("Banner Click", {
                            "Device": "M-Site",
                            "Page": "Category Page",
                            "Banner Name": banner.name
                        });
                    console.log("clevertap Category Page Banner Click");
                    var catbnnGtm =  "UserId=" + utility.getJStorageKey("userId") + "/BannerName=" + banner.name;   
                    dataLayer.push('send', { hitType: 'event', eventCategory: 'Mobile Banner Click', 
                        eventAction: 'Category Page', eventLabel: catbnnGtm}
                        );console.log(catbnnGtm);console.log(dataLayer);
                    }else{
                        clevertap.event.push("Banner Click", {
                            "Device": "M-Site",
                            "Page": "Home Page",
                            "Banner Name": banner.name
                        });
                    console.log("clevertap Home Page Banner Click");
                     var hmbnnGtm =  "UserId=" + utility.getJStorageKey("userId") + "/BannerName=" + banner.name;      
                        dataLayer.push('send', { hitType: 'event', eventCategory: 'Mobile Banner Click', 
                        eventAction: 'Home Page', eventLabel: hmbnnGtm}
                        );console.log(hmbnnGtm);console.log(dataLayer);
                    }
                }catch(err){console.log("Error in GTM fire.");}
                var arrBanner = banner.linkurl.split('?'),
                    url = arrBanner[0],
                    queryParams = arrBanner[1].split('='),
                    queryKey = queryParams[0],
                    queryValue = queryParams[1];
                if(url == "dealproductlisting") {
                    $location.url("product/deal/" + queryValue);
                } else if(url == "search") {
                    $location.url("product?keyword=" + queryValue);
                } else if(url == "dealsbydealtype") {
                    $location.url("deals/" + queryValue);
                } else if(url == "offerbydealtype") {
                    $location.url("category/offers/" + queryValue);
                } else if(url == "productlistall") {
                    $location.url("product/" + queryValue);
                } else if(url == "specialdeal"){
                    //$location.url("specialdeal?sku=" + queryValue+"@"+banner.name);
                    $location.url("specialdeal?sku=" + queryValue);
                } else if(url == "singlepage"){
                    $location.url("singlepage/" + queryValue);
                }    
            };

            $scope.navigateToHotOffers = function() {
                $location.url("hot-offers");
            };

            $scope.showShopByCategory = true;
            $scope.showShopByDeals = false;

            $scope.toggleMaxMoneyCategory = function(){
                if(utility.getJStorageKey("userId")){
                    $location.url('user/maxmoneyhistory');
                }else {
                    $location.url('user/login');
                }
            };

            $scope.toggleCoinsCategory = function(){
                if(utility.getJStorageKey("userId")){
                    $location.url('user/coinshistory');
                }else {
                    $location.url('user/login');
                }
            };

            $scope.toggleShopByCategory = function() {
                if($scope.showShopByCategory) {                    
                    $scope.showShopByCategory = false;
                    $scope.showShopByDeals = true;
                } else {
                    $scope.showShopByCategory = true;
                    $scope.showShopByDeals = false;                    
                }
            };

            $scope.toggleShopByDeals = function() {
                if($scope.showShopByDeals) {
                    $scope.showShopByDeals = false;
                    $scope.showShopByCategory = true;
                } else {
                    $scope.showShopByDeals = true;
                    $scope.showShopByCategory = false;
                }
            };

            $scope.getOfferImage = function(item) {
                if(item.image.indexOf('Deal_') >= 0) {
                    return item.image.replace("Deal_", "deal_");
                } else {
                    return item.image + "deal_" + item.id + ".png";
                }
            };

            angular.element(document).ready(function () {
                if(angular.isUndefined(utility.getJStorageKey("selectedCity"))
                    || !utility.getJStorageKey("selectedCity")) {
                    getCityList();
                } else {
                    $scope.selectedCity = utility.getJStorageKey("selectedCity");
                }
            });
			
			$scope.homePageRedirect = function(){
				$scope.showCategoryMenu = !$scope.showCategoryMenu;
				$('body').css('overflow', 'auto');

                if(isDrawerOpen) {
                    $analytics.eventTrack($scope.selectedCity, {  category: "Close Drawer"});
                    isDrawerOpen = false;
                }
			}
			
			$scope.closeStrip = false;
			$scope.hideStrip = function(value){
                try{
                    clevertap.event.push("Popup Click", {
                            "Device": "M-Site",
                            //"Page": "Home Page",
                            "Popup Name": "Download App",
                            "Button Clicked": value
                        });
                    console.log("clevertap Mobile Widgets");
                     var appdwonGtml = "UserId=" + utility.getJStorageKey("userId") + "/Action=" + value;
                    dataLayer.push('send', { hitType: 'event', eventCategory: 'Mobile Widgets', 
                        eventAction: 'Download App', eventLabel:appdwonGtml}
                        );
                }catch(err){console.log("Error in GTM fire.");}
				$scope.closeStrip = !$scope.closeStrip;
			}
			$timeout(function () {
				$("section").removeClass("no-animate");
				$scope.closeStrip = true; 
			}, 5000);
			
			$scope.trendList = false;
			$scope.trendingSearchList = function(){
				$scope.trendList = !$scope.trendList;
			}
			
			$scope.getTrendingName = function(value){
				$scope.searchKeyword = value;
				$scope.handleSearchKeyEnter();
			}
            $scope.andriodDownloat = function(value){
                try{
                    clevertap.event.push("Popup Click", {
                            "Device": "M-Site",
                            //"Page": "Home Page",
                            "Popup Name": "Download App",
                            "Button Clicked": value
                        });
                    console.log("clevertap Mobile Widgets");
                    var appdwonGtl = "UserId=" + utility.getJStorageKey("userId") + "/Action=" + value;
                    dataLayer.push('send', { hitType: 'event', eventCategory: 'Mobile Widgets', 
                        eventAction: 'Download App', eventLabel:appdwonGtl}
                        );console.log(dataLayer);
                }catch(err){console.log("Error in GTM fire.");}
            }

            
            if($routeParams.pageName == "contact"){
                clevertap.event.push("Drawer Activity", {
                            "Device": "M-Site",
                            "Action Performed" : "Contact Us"
                        });
             }
             if($routeParams.pageName == "faq"){
                clevertap.event.push("Drawer Activity", {
                            "Device": "M-Site",
                            "Action Performed" : "FAQ's"
                        });
             }
             if($routeParams.pageName == "about"){
                clevertap.event.push("Drawer Activity", {
                            "Device": "M-Site",
                            "Action Performed" : "About Us"
                        });
             }
            if($routeParams.pageName == 'term'){
                clevertap.event.push("Drawer Activity", {
                            "Device": "M-Site",
                            "Action Performed" : "Terms of Service"
                        });
                angular.element('body').css('overflow', 'auto');
            }

        }
    ]);
});
