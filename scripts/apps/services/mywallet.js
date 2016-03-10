define(['app'], function (app) {
    app.service('mywalletService', ['$http', '$rootScope', 'serverUtility',
    	function ($http, $rootScope, serverUtility) {
		    'use strict';

		    this.getWalletAmount = function(userId) {		    	
	    		var url = getAPIUrl() + "getwalletbalance?CustId=" + userId;
		    	return serverUtility.getWebService(url)
		    		.then(
		    			function(data){return data;},
		    			function(error){return error; }
		    		);		    			    	
		    };   

	    	return this;
    	}
    ]);
});