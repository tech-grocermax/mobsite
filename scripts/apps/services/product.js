define(['app'], function (app) {
    app.service('productService', ['$http', '$rootScope', 'serverUtility',
    	function ($http, $rootScope, serverUtility) {
		    'use strict';
		    
		    this.getProductList = function(categoryId) {
		    	var url = getAPIUrl() + "productlist?cat_id=" + categoryId;
		    	return serverUtility.getWebService(url)
		    		.then(function(data){return data}, function(error){return error});
		    };	 

		    this.getProductDetails = function(productId) {
		    	var url = getAPIUrl() + "productlist?pro_id=" + productId;
		    	return serverUtility.getWebService(url)
		    		.then(function(data){return data}, function(error){return error});
		    };  

		    this.addProduct = function(products, quoteId) {
		    	var strProducts = JSON.stringify(products),
		    		url = getAPIUrl() + "addtocartgust?products=" + strProducts;

		    	url = angular.isDefined(quoteId) ? url + "&quote_id=" + quoteId : url;		    		
		    	return serverUtility.getWebService(url)
		    		.then(function(data){return data}, function(error){return error});
		    };

		    this.getCartItemDetails = function(quoteId) {
		    	var url = getAPIUrl() + "cartdetail?quote_id=" + quoteId;
		    	return serverUtility.getWebService(url)
		    		.then(function(data){return data}, function(error){return error});
		    };
	    
	    	return this;
    	}
    ]);
});