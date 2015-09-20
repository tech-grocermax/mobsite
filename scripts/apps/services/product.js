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

		    this.cartAddProduct = function(products, quoteId) {
		    	var strProducts = JSON.stringify(products),
		    		url = getAPIUrl() + "addtocartgust?products=" + strProducts;

		    	return serverUtility.getWebService(url)
		    		.then(function(data){return data}, function(error){return error});
		    };

		    this.cartUpdateProduct = function(products, quoteId, firstAddedProduct) {
		    	var strProducts = JSON.stringify(products),
		    		productid = new Array(firstAddedProduct),
		    		strProductId = JSON.stringify(productid),
		    		url = getAPIUrl() + "deleteitem?productid=" + strProductId 
		    		+ "&quote_id=" + quoteId 
		    		+ "&updateid=" + strProducts;

		    	return serverUtility.getWebService(url)
		    		.then(function(data){return data}, function(error){return error});
		    };

		    this.getCartItemDetails = function(quoteId) {
		    	var url = getAPIUrl() + "cartdetail?quote_id=" + quoteId;
		    	return serverUtility.getWebService(url)
		    		.then(function(data){return data}, function(error){return error});
		    };
		    
		    this.getProductListBySearch = function(keyword) {
		    	var url = getAPIUrl() + "search?keyword=" + keyword;
		    	return serverUtility.getWebService(url)
		    		.then(function(data){return data}, function(error){return error});
		    };
	    
	    	return this;
    	}
    ]);
});