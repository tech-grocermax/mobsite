define(['app'], function (app) {
    app.service('userService', ['$http', '$rootScope', 'serverUtility',
    	function ($http, $rootScope, serverUtility) {
		    'use strict';
		    
		    this.createUser = function(input) {		    	
	    		var url = getAPIUrl() + "createuser?" + $.param( input );
		    	return serverUtility.getWebService(url)
		    		.then(
		    			function(data){return data; },
		    			function(error){return error; }
		    		);		    			    	
		    }; 

		    this.loginUser = function(input) {		    	
	    		var url = getAPIUrl() + "login?" + $.param( input );
		    	return serverUtility.getWebService(url)
		    		.then(
		    			function(data){return data; },
		    			function(error){return error; }
		    		);		    			    	
		    };

		    this.getUserProfile = function(userId) {		    	
	    		var url = getAPIUrl() + "userdetail?userid= " + userId;
		    	return serverUtility.getWebService(url)
		    		.then(
		    			function(data){return data; },
		    			function(error){return error; }
		    		);		    			    	
		    };

		    this.buildUpdateProfileObject = function(input, userId) {
		    	return {
		    		"userid" : userId,
			    	"fname" : input.fname,
			    	"lname" : input.lname,
			    	"number" : input.number
		    	};		    	
		    };

		    this.updateProfile = function(input, userId) {
		    	var url = getAPIUrl() + "editprofile?" 
		    		+ $.param(this.buildUpdateProfileObject(input, userId));
		    	return serverUtility.getWebService(url)
		    		.then(
		    			function(data){return data; },
		    			function(error){return error; }
		    		);
		    };

		    this.getAddressList = function(userId) {
		    	var url = getAPIUrl() + "getaddress?userid=" + userId;
		    	return serverUtility.getWebService(url)
		    		.then(
		    			function(data){return data; },
		    			function(error){return error; }
		    		);
		    };

		    this.extractAddressById = function(addressList, addressId) {
		    	var address = null;
		    	angular.forEach(addressList, function(value, key) {
		    		if(addressId == value.customer_address_id) {
		    			address = value;
		    		}
		    	});
		    	return address;
		    };

		    this.buildSaveUpdateAddressObject = function(data, userId, addressId) {
		    	var obeject = {
		    		userid  : userId,
					fname : data.firstname,
					lname : data.lastname,
					addressline1 : data.street,
					city : data.city,
					state : data.region,
					pin : data.postcode,
					countrycode : data.country_id,
					phone : data.telephone,
					default_billing : data.is_default_billing ? 1 : 0,
					default_shipping : data.is_default_shipping ? 1 : 0
		    	};
		    	if(addressId){
		    		obeject.addressid = addressId;
		    	}
		    	return obeject;
		    };
	    	
	    	this.saveAddress = function(data, userId, addressId) {
	    		//this.buildSaveUpdateAddressObject(data, userId, addressId
	    		data.userid = userId;
	    		if(addressId){
		    		data.addressid = addressId;
		    	}
	    		var actionUrl = addressId ? "editaddress" : "addaddress";
		    	var url = getAPIUrl() + actionUrl + "?" 
		    		+ $.param(data);
		    	return serverUtility.getWebService(url)
		    		.then(
		    			function(data){return data; },
		    			function(error){return error; }
		    		);
		    };

		    this.getOrderHistory = function(email) {
		    	var url = getAPIUrl() + "orderhistory?email=" + email;
		    	return serverUtility.getWebService(url)
		    		.then(
		    			function(data){return data; },
		    			function(error){return error; }
		    		);
		    };

		    this.getDeliverySlots = function(userId) {
		    	var url = getAPIUrl() + "getaddresswithtimeslot?userid=" + userId;
		    	return serverUtility.getWebService(url)
		    		.then(
		    			function(data){return data; },
		    			function(error){return error; }
		    		);
		    };

		    this.forgotPassword = function(email) {
		    	var url = getAPIUrl() + "forgotpassword?uemail=" + email;
		    	return serverUtility.getWebService(url)
		    		.then(
		    			function(data){return data; },
		    			function(error){return error; }
		    		);
		    };

		    this.changePassword = function(input) {
		    	//var url = getAPIUrl() + "forgotpassword?uemail=" + email;
		    	var url = getAPIUrl() + "changepassword?" + $.param( input );
		    	return serverUtility.getWebService(url)
		    		.then(
		    			function(data){return data; },
		    			function(error){return error; }
		    		);
		    };

		    this.logout = function(userId) {
		    	var url = getAPIUrl() + "logout?userid=" + userId;
		    	return serverUtility.getWebService(url)
		    		.then(
		    			function(data){return data; },
		    			function(error){return error; }
		    		);
		    };

		    this.getLocationList = function(cityId) {
		    	//http://staging.grocermax.com/webservice/new_services/getlocality?cityid=1
		    	var url = getAPIUrl() + "getlocality?cityid=" + cityId;
		    	return serverUtility.getWebService(url)
		    		.then(
		    			function(data){return data; },
		    			function(error){return error; }
		    		);
		    };

		    this.buildShippingObject = function(shippingObject) {
		    	return {
		    		"addressline2":"",
		    		"default_billing":"0",
		    		"lname":shippingObject.lastname,
		    		"addressline1":shippingObject.street,
		    		"country_id":shippingObject.country_id,
		    		"postcode":shippingObject.postcode,
		    		"telephone":shippingObject.telephone,
		    		"default_shipping":shippingObject.is_default_shipping,
		    		"fname":shippingObject.firstname,
		    		"city":shippingObject.city
		    	};

		    };

		    this.buildBillingObject = function(billingObject) {
		    	return {
		    		"addressline2":"",
		    		"default_billing":billingObject.is_default_billing,
		    		"lname":billingObject.lastname,
		    		"addressline1":billingObject.street,
		    		"country_id":billingObject.country_id,
		    		"postcode":billingObject.postcode,
		    		"telephone":billingObject.telephone,
		    		"default_shipping":billingObject.is_default_shipping,
		    		"fname":billingObject.firstname,
		    		"city":billingObject.city
		    	};
		    };

		    this.buildCheckoutObject = function(userId, quoteId, checkoutDetails, paymentMethod) {
		    	var shippingObject = this.buildShippingObject(checkoutDetails[quoteId]["shippingAddress"]);
		    	var billingObject = this.buildBillingObject(checkoutDetails[quoteId]["billingAddress"]);

		    	var shipping = JSON.stringify(shippingObject);
		    	var billing = JSON.stringify(billingObject);
		    	return {
		    		userid:userId,
		    		quote_id:quoteId,
		    		shipping:shipping,
		    		billing:billing,
		    		payment_method:paymentMethod,
		    		shipping_method:"tablerate_bestway",
		    		timeslot:checkoutDetails[quoteId].deliveryTime,
		    		date:checkoutDetails[quoteId].deliveryDate
		    	};
		    };

		    this.checkout = function(userId, quoteId, checkoutDetails, paymentMethod) {
		    	var input = $.param(this.buildCheckoutObject(userId, quoteId, checkoutDetails, paymentMethod));
		    	console.log(input);
		    	var url = getAPIUrl() + "checkout?" + input;
		    	return serverUtility.getWebService(url)
		    		.then(
		    			function(data){return data; },
		    			function(error){return error; }
		    		);
		    };

	    	return this;
    	}
    ]);
});