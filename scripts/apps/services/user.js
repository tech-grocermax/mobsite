define(['app'], function (app) {
    app.service('userService', ['$http', '$rootScope', 'serverUtility',
    	function ($http, $rootScope, serverUtility) {
		    'use strict';
		    
		    this.createUser = function(input) {		    	
	    		var url = getAPIUrl() + "createuser";
	    		return serverUtility.postWebService(url, input)
		    		.then(
		    			function(data){return data;},
		    			function(error){return error; }
		    		);		    			    	
		    }; 

		    this.fbregister = function(input) {		    	
	    		var url = getAPIUrl() + "fbregister";
	    		return serverUtility.postWebService(url, input)
		    		.then(
		    			function(data){return data;},
		    			function(error){return error; }
		    		);		    			    	
		    };

		    this.loginUser = function(input) {		    	
	    		var url = getAPIUrl() + "login";
	    		return serverUtility.postWebService(url, input)
		    		.then(
		    			function(data){return data; },
		    			function(error){return error; }
		    		);		    			    	
		    };

		    this.getUserProfile = function(userId) {		    	
	    		var url = getAPIUrl() + "userdetail?userid=" + userId;
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
			    	"number" : input.number,
					"otp"    : input.otp
		    	};		    	
		    };

		    this.updateProfile = function(inputData, userId) {
		    	var url = getAPIUrl() + "editprofile",
		    		input = this.buildUpdateProfileObject(inputData, userId);
		    	return serverUtility.postWebService(url, input)
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
	    	
	    	this.saveAddress = function(input, userId, addressId) {
	    		//this.buildSaveUpdateAddressObject(data, userId, addressId
	    		input.userid = userId;
	    		if(addressId){
		    		input.addressid = addressId;
		    	}
	    		var actionUrl = addressId ? "editaddress" : "addaddress",
	    			url = getAPIUrl() + actionUrl;

		    	return serverUtility.postWebService(url, input)
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

		    this.getMaxCoinsHistory = function(userid) {
		    	var url = getAPIUrl() + "redeempointlog?user_id=" + userid;
		    	return serverUtility.getWebService(url)
		    		.then(
		    			function(data){return data; },
		    			function(error){return error; }
		    		);
		    };

		    this.getMaxMoneyHistory = function(userid) {
		    	var url = getAPIUrl() + "creditlog?userid=" + userid;
		    	return serverUtility.getWebService(url)
		    		.then(
		    			function(data){return data; },
		    			function(error){return error; }
		    		);
		    };

		    this.getWalletBalance = function(userid){
		    	var url = getAPIUrl() + "getwalletbalance?CustId=" + userid;
		    	return serverUtility.getWebService(url)
		    		.then(
		    			function(data){return data; },
		    			function(error){return error; }
		    		);
		    };

		    this.getOrderDetails = function(orderId) {
		    	var url = getAPIUrl() + "getorderdetail?orderid=" + orderId;
		    	return serverUtility.getWebService(url)
		    		.then(
		    			function(data){return data;},
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
		    	var input = {
			    		uemail: email
			    	},
			    	url = getAPIUrl() + "forgotpassword";
		    	return serverUtility.postWebService(url, input)
		    		.then(
		    			function(data){return data;},
		    			function(error){return error; }
		    		);
		    };
			
			this.reOrder = function(increment_id){
				var orderid = increment_id, 				
				url = getAPIUrl() + "reorder?orderid=" + increment_id;
				return serverUtility.getWebService(url , orderid)
					.then(
						function(data){return data;},
						function(error){return error;}
					);
			};

		    this.changePassword = function(input) {
		    	var url = getAPIUrl() + "changepassword";
		    	return serverUtility.postWebService(url, input)
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
		    		"city":shippingObject.city,
					"region":shippingObject.region,
					"region_id":shippingObject.region_id
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
		    		"city":billingObject.city,
					"region":billingObject.region,
					"region_id":billingObject.region_id
		    	};
		    };

		    this.buildCheckoutObject = function(userId, quoteId, checkoutDetails, paymentMethod,maxMoney) {
		    	var shippingObject = this.buildShippingObject(checkoutDetails[quoteId]["shippingAddress"]),
		    		billingObject = this.buildBillingObject(checkoutDetails[quoteId]["billingAddress"]),
		    		shipping = shippingObject,
		    		billing = billingObject;

		    	return {
		    		userid:userId,
		    		quote_id:quoteId,
		    		shipping:shipping,
		    		billing:billing,
		    		maxMoney:maxMoney,
		    		payment_method:paymentMethod,
		    		shipping_method:"tablerate_bestway",
		    		timeslot:checkoutDetails[quoteId].deliveryTime,
		    		date:checkoutDetails[quoteId].deliveryDate
		    	};
		    };

		    this.checkout = function(userId, quoteId, checkoutDetails, paymentMethod,maxMoney) {
		    	/*var input = $.param(this.buildCheckoutObject(userId, quoteId, checkoutDetails, paymentMethod)),
		    		url = getAPIUrl() + "checkout?" + input;*/

		    	var input = this.buildCheckoutObject(userId, quoteId, checkoutDetails, paymentMethod,maxMoney),
		    		url = getAPIUrl() + "checkout";
		    	return serverUtility.postWebService(url, input)
		    		.then(
		    			function(data){return data; },
		    			function(error){return error; }
		    		);
		    };

		    this.trackorderdetails = function(orderid) {
		    	var input = {OrderID: orderid},
		    		url = getAPIUrl() + "loadOrderDetail";
		    	return serverUtility.postWebService(url, input)
		    		.then(
		    			function(data){return data; },
		    			function(error){return error; }
		    		);
		    };

		    this.getPaytmProcessingDetails = function(orderId, customerId, email, mobile) {
		    	//returnUrl = "http://localhost/grocermax/#/payment/response"
		    	// & need to build new router 
		    	var input = {
		    			OrderID: orderId,
		    			customerId: customerId,
		    			email: email,
		    			mobile: mobile
		    		},
		    		url = getAPIUrl() + "paytmredirect";	    

		    	return serverUtility.postWebService(url, input)
		    		.then(
		    			function(data){return data; },
		    			function(error){return error; }
		    		);
		    };

		    this.getStateList = function(cityId) {
		    	var url = getAPIUrl() + "getstate";
		    	return serverUtility.getWebService(url)
		    		.then(
		    			function(data){return data; },
		    			function(error){return error; }
		    		);
		    };

		    this.deleteAddress = function(addressId) {
		    	var url = getAPIUrl() + "deleteaddress?addressid=" + addressId;
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