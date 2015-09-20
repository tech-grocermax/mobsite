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
	    		var actionUrl = addressId ? "editaddress" : "addaddress";
		    	var url = getAPIUrl() + actionUrl + "?" 
		    		+ $.param(this.buildSaveUpdateAddressObject(data, userId, addressId));
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

	    	return this;
    	}
    ]);
});