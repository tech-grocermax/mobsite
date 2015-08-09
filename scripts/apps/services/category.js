define(['app'], function (app) {
    app.service('categoryService', ['$http', '$rootScope', 'serverUtility',
    	function ($http, $rootScope, serverUtility) {
		    'use strict';
		   
		    this.getCategoryList = function() {
		    	var url = getAPIUrl() + "category?parentid=0";
		    	return serverUtility.getWebService(url)
		    		.then(function(data){return data}, function(error){return error});
		    };	     
	    
	    	return this;
    	}
    ]);
});