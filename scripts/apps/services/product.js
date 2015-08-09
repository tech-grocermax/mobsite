define(['app'], function (app) {
    app.service('productService', ['$http', '$rootScope', 'serverUtility',
    	function ($http, $rootScope, serverUtility) {
		    'use strict';
		    
		    this.getProductList = function(categoryId) {
		    	var url = getAPIUrl() + "productlist?cat_id=" + categoryId;
		    	return serverUtility.getWebService(url)
		    		.then(function(data){return data}, function(error){return error});
		    };	     
	    
	    	return this;
    	}
    ]);
});