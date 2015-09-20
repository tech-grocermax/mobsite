define(['app'], function (app) {
    app.service('categoryService', ['$http', '$rootScope', 'serverUtility', 'utility',
    	function ($http, $rootScope, serverUtility, utility) {
		    'use strict';
		   
		    this.getCategoryList = function() {		    	
	    		var url = getAPIUrl() + "category?parentid=0";
		    	return serverUtility.getWebService(url)
		    		.then(
		    			function(data){return data; },
		    			function(error){return error; }
		    		);		    			    	
		    };	 

		    this.getSubCategoryList = function(categories, categoryId) {
		    	var subCategoryList = null;
		    	if(categories.length){
		    		angular.forEach(categories, function(value, key) {
		    			if(value.category_id == categoryId){
							subCategoryList = value.children;
		    			}
		    		});
		    	}
		    	return subCategoryList;
		    }; 

		    this.getCategoryName = function(categories, categoryId){
				var categoryName = null;
		    	if(categories.length){
		    		angular.forEach(categories, function(value, key) {
		    			if(value.category_id == categoryId){
							categoryName = value.name;
		    			}
		    		});
		    	}
		    	return categoryName;
		    };

		    this.isSpecialCategory = function(categoryId) {
		    	var specialCatList = ["2506", "2436", "2212", "2242", "2278", 
                    "2282", "2392", "2395", "2399",
                    "2269", "2258", "2248", "2265", "2254",
                    "2347", "2335", "2343", "2355",
                    "2360", "2372", "2382", "2380", "2387"];

                return angular.isDefined(categoryId) && 
                    specialCatList.indexOf(categoryId) >= 0 ? true : false;
		    };

		    this.getLastChildCategoryList = function(categories, categoryId) {
		    	var that = this;
		    	var lastChildCategoryList = null;
		    	if(categories.length){
		    		angular.forEach(categories, function(value, key) {
		    			angular.forEach(value.children, function(innerValue, innerKey) {
		    				var isSpecial = that.isSpecialCategory(categoryId);
		    				if(isSpecial) {
				    			if(innerValue.category_id == categoryId){
									lastChildCategoryList = innerValue.children;
				    			}
		    				} else {
		    					angular.forEach(innerValue.children, function(lastValue, lastKey) {
					    			if(lastValue.category_id == categoryId){
										lastChildCategoryList = lastValue.children;
					    			}
		    					});
		    				}
		    			});		    			

		    		});
		    	}
		    	return lastChildCategoryList;
		    };
	    
	    	return this;
    	}
    ]);
});