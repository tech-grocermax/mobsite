define(['app'], function (app) {
    app.service('productService', ['$http', '$rootScope', 'serverUtility', 'utility',
    	function ($http, $rootScope, serverUtility, utility) {
		    'use strict';
		    
		    this.getProductListByCategoryId = function(categoryId, page) {
		    	var url = getAPIUrl() + "productlist?cat_id=" + categoryId + "&page=" + page;
		    	return serverUtility.getWebService(url)
		    		.then(function(data){return data}, function(error){return error});
		    };

		    this.getAllProductListByCategoryId = function(categoryId, page) {
		    	var url = getAPIUrl() + "productlistall?cat_id=" + categoryId + "&msite=true";
		    	return serverUtility.getWebService(url)
		    		.then(function(data){return data}, function(error){return error});
		    };

		   this.getSpecialDealListBySku = function(specialDealSku, page) {
		    	var url = getAPIUrl() + "specialdeal?sku=" + specialDealSku;
		    	return serverUtility.getWebService(url)
		    		.then(function(data){return data}, function(error){return error});
		    };

		    this.getDealsByDealId = function(dealId, page) {
		    	var url = getAPIUrl() + "dealsbydealtype?deal_type_id=" + dealId;
		    	return serverUtility.getWebService(url)
		    		.then(function(data){return data}, function(error){return error});
		    };

		    this.getProductListByDealId = function(dealId) {
		    	var url = getAPIUrl() + "dealproductlisting?deal_id=" + dealId;
		    	return serverUtility.getWebService(url)
		    		.then(function(data){return data}, function(error){return error});
		    }; 

		    this.getProductDetails = function(productId) {
		    	var url = getAPIUrl() + "productdetail?pro_id=" + productId;
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
		    	if(angular.isDefined(utility.getJStorageKey("userId")) && utility.getJStorageKey("userId")) {
		    		url = url + "&userid=" + utility.getJStorageKey("userId");
		    	}
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

            this.buildAddCouponObject = function(userId, quoteId, couponCode) {
            	return {
            		userid: userId,
            		quote_id: quoteId,
            		couponcode: couponCode
            	};
            };

            this.applyCoupon = function(userId, quoteId, couponCode) {
            	var url = getAPIUrl() + "addcoupon?" + 
            		$.param(this.buildAddCouponObject(userId, quoteId, couponCode));

		    	return serverUtility.getWebService(url)
		    		.then(function(data){return data}, function(error){return error});
            };

            this.removeCoupon = function(userId, quoteId, couponCode) {
            	var url = getAPIUrl() + "removecoupon?" + 
            		$.param(this.buildAddCouponObject(userId, quoteId, couponCode));

		    	return serverUtility.getWebService(url)
		    		.then(function(data){return data}, function(error){return error});
            };
	    
	    	return this;
    	}
    ]);
});