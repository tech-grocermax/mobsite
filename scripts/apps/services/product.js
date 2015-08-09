define(['app'], function (app) {
    app.service('productService', ['$http', '$rootScope', 'serverUtility',
    	function ($http, $rootScope, serverUtility) {
		    'use strict';
		    var webService = {
				"prod" : "product",
		    	"prodDtls": "product-details/:productId"
		    };

		    this.getProductList = function() {
		    	var url = getAPIUrl() + "test";
		    	return serverUtility.getWebService(url)
		    		.then(function(data){return data}, function(error){return error});
		    };	     
	    
	    	return this;
    	}
    ]);
});