define(['app'], function (app) {
    app.service('productService', ['$http', '$rootScope', 'serverUtility',
    	function ($http, $rootScope, serverUtility) {
		    'use strict';
		    
		    this.getProductListByCategoryId = function(categoryId) {
		    	var url = getAPIUrl() + "productlist?cat_id=" + categoryId;
		    	return serverUtility.getWebService(url)
		    		.then(function(data){return data}, function(error){return error});
		    };	

		    this.getProductListByDealId = function(dealId) {
		    	var url = getAPIUrl() + "dealproductlisting?deal_id=" + dealId;
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

		    	return serverUtility.postWebService(url)
		    		.then(function(data){return data}, function(error){return error});
		    };

		    this.cartUpdateProduct = function(quoteId, products, productid) {
		    	var url = getAPIUrl() + "deleteitem?productid=" + JSON.stringify(productid) 
		    		+ "&quote_id=" + quoteId 
		    		+ "&updateid=" + JSON.stringify(products);

		    	return serverUtility.postWebService(url)
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