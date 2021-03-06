define(['app'], function (app) {
    app.service('serverUtility', function ($http) {
	    'use strict';	    
    
	    this.getWebService = function(url, params) {
	    	params = angular.isDefined(params) ? params : {};
	    	return $http.get(url)
	    		.then(function(response){return response.data}, function(error){return error});
	    };	

	    this.postWebService = function(url, input) {
	    	return $http.post(url, input)
	    		.then(function(response){return response.data}, function(error){return error});
	    };     
	    
	    return this;
    });
});