define(['app'], function (app) {
    app.service('categoryService', ['$http', '$rootScope', 'serverUtility', 'utility',
    	function ($http, $rootScope, serverUtility, utility) {
		    'use strict';
		   
			this.getHomePageList = function() {
		   		var url = getAPIUrl() + "homepage";
		    	return serverUtility.getWebService(url)
		    		.then(
		    			function(data){
							return data; 
						},
		    			function(error){return error; }
		    		);
		   	};
		   
		   	/*this.getBannerList = function() {
		   		var url = getAPIUrl() + "homebanner";
		    	return serverUtility.getWebService(url)
		    		.then(
		    			function(data){return data; },
		    			function(error){return error; }
		    		);
		   	};

		    this.getCategoryList = function() {		    	
	    		var url = getAPIUrl() + "category?parentid=0";
		    	return serverUtility.getWebService(url)
		    		.then(
		    			function(data){return data; },
		    			function(error){return error; }
		    		);		    			    	
		    };	 */

		    this.getSubCategoryBanner = function(categoryId) {		    	
	    		var url = getAPIUrl() + "subcategorybanner?cat_id=" + categoryId;
		    	return serverUtility.getWebService(url)
		    		.then(
		    			function(data){return data;},
		    			function(error){return error;}
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

		   /* this.getDealList = function() {		    	
	    		var url = getAPIUrl() + "shopbydealtype";
		    	return serverUtility.getWebService(url)
		    		.then(
		    			function(data){return data; },
		    			function(error){return error; }
		    		);		    			    	
		    };

		    this.getCategoryOfferList = function() {		    	
	    		var url = getAPIUrl() + "shopbycategory";
		    	return serverUtility.getWebService(url)
		    		.then(
		    			function(data){return data; },
		    			function(error){return error; }
		    		);		    			    	
		    };*/

		    this.getDealsByDealId = function(dealId) {		    	
	    		var url = getAPIUrl() + "dealsbydealtype?deal_type_id=" + dealId;
		    	return serverUtility.getWebService(url)
		    		.then(
		    			function(data){return data; },
		    			function(error){return error; }
		    		);		    			    	
		    };
			
			/*this.getSpecialDealsBySku = function(specialDealSku) {		    	
	    		var url = getAPIUrl() + "specialdeal?sku=" + specialDealSku;
		    	return serverUtility.getWebService(url)
		    		.then(
		    			function(data){return data; },
		    			function(error){return error; }
		    		);		    			    	
		    };*/
		

		    this.getDealsByDealCategoryId = function(dealCategoryId) {		    	
	    		var url = getAPIUrl() + "offerbydealtype?cat_id=" + dealCategoryId;
		    	return serverUtility.getWebService(url)
		    		.then(
		    			function(data){return data; },
		    			function(error){return error; }
		    		);		    			    	
		    };


		    this.getCategoryNameInDepth = function(categories, categoryId) {
		    	var catName = null;
		    	if(categories.length){
		    		angular.forEach(categories, function(value, key) {
		    			if(value.category_id == categoryId) {
		    				catName = value.name;
		    			} 
		    			angular.forEach(value.children, function(innerValue, innerKey) {	
		    				if(innerValue.category_id == categoryId) {
			    				catName = innerValue.name;
			    			}	    				
	    					angular.forEach(innerValue.children, function(lastValue, lastKey) {
				    			if(lastValue.category_id == categoryId) {
				    				catName = lastValue.name;
				    			}
				    			/*angular.forEach(lastValue.children, function(v, k) {
					    			if(v.category_id == categoryId) {
					    				catName = v.name;
					    			}
		    					});*/
	    					});		    				
		    			});		    			

		    		});					
		    	}
		    	return catName;
		    };

		   /* this.getSpecialDealName = function(specialDeal, specialDealLinkurl){
				var SpecialDealName = null;
		    	if(specialDeal.length){
		    		angular.forEach(specialDeal, function(value, key) {
		    			if(value.linkurl.split("=")[1] == specialDealLinkurl){
		    				SpecialDealName = value.name;
		    			}
		    		});
		    	}
		    	return SpecialDealName;
		    };*/
	    
	    	return this;
    	}
    ]);
});