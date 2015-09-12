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
	    
	    	return this;
    	}
    ]);
});