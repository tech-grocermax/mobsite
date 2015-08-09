define(['app'], function (app) {
    app.service('categoryService', ['$http', '$rootScope', 'serverUtility',
    	function ($http, $rootScope, serverUtility) {
		    'use strict';
		    var webService = {
				"cat" : "category",
				"catDtls": "category-details/:categoryId"
		    };

		    this.getCategoryList = function() {
		    	var url = getAPIUrl() + "category";
		    	return serverUtility.getWebService(url)
		    		.then(function(data){return data}, function(error){return error});
		    };	     
	    
	    	return this;
    	}
    ]);
});