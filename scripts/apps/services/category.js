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
	    
	    	return this;
    	}
    ]);
});