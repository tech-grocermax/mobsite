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

		    this.samplePersonalInfo = function() {
		    	return {
					customer_id: "323",
					created_at: "2015-03-13T20:48:05+05:30",
					updated_at: "2015-06-10 05:34:53",
					increment_id: null,
					store_id: "1",
					website_id: "1",
					confirmation: null,
					created_in: "English",
					default_billing: "357",
					default_shipping: "357",
					disable_auto_group_change: "0",
					dob: null,
					email: "sharan.radhakrishnan@outlook.com",
					firstname: "Sharan",
					gender: null,
					group_id: "1",
					lastname: "Radhakrishnan",
					middlename: null,
					mobile: "09560388335",
					password_hash: "2c49a092380707f60614b078c809dd77:wCubORBTeBMLNPLOs1eVTqGsMWnnb7En",
					prefix: null,
					reward_update_notification: null,
					reward_warning_notification: null,
					rp_token: null,
					rp_token_created_at: null,
					suffix: null,
					taxvat: null
				};
		    };
	    
	    	return this;
    	}
    ]);
});