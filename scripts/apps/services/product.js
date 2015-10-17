define(['app'], function (app) {
    app.service('productService', ['$http', '$rootScope', 'serverUtility',
    	function ($http, $rootScope, serverUtility) {
		    'use strict';
		    
		    this.getProductListByCategoryId = function(categoryId, page) {
		    	var url = getAPIUrl() + "productlist?cat_id=" + categoryId + "&page=" + page;
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
		    	var input = {
			    		quote_id: quoteId,
			    		products: products
			    	},
			    	url = getAPIUrl() + "addtocartgust";
			    	
		    	return serverUtility.postWebService(url, input)
		    		.then(function(data){return data}, function(error){return error});
		    };

		    this.cartUpdateProduct = function(quoteId, products, productid) {
		    	var input = {
			    		productid: productid,
			    		quote_id: quoteId,
			    		updateid: products
			    	},
			    	url = getAPIUrl() + "deleteitem";

		    	return serverUtility.postWebService(url, input)
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

		    this.getCartItemCount = function(items) {
                var count = 0;
                angular.forEach(items, function(value, key) {
                    count = count + parseInt(value.qty, 10);        
                });
                return count;
            };
	    
	    	return this;
    	}
    ]);
});