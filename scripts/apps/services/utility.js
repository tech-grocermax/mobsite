define(['app'], function (app) {
    app.service('utility', ['$http', 'serverUtility',
    	function ($http, serverUtility) {
		    'use strict';	    
	    
		    this.getJStorageKey = function(key) {
		    	return $.jStorage.get(key);
		    };	

		    this.setJStorageKey = function(key, value, time) {
		    	time = angular.isDefined(time) ? time : 1;
		    	$.jStorage.set(key, value);
				$.jStorage.setTTL(key, time * 24 * 3600 * 1000);
		    };

		    this.deleteJStorageKey = function(key) {
		    	$.jStorage.deleteKey(key);
		    };

		    this.getCurrentDate = function() {
		        var today = new Date(),
		        	dd = today.getDate(),
		        	mm = today.getMonth()+1,
		        	yyyy = today.getFullYear();

		        if(dd < 10){
		            dd = '0' + dd
		        } 
		        if(mm < 10){
		            mm = '0' + mm
		        } 
		        return (yyyy + '-' + mm + '-' + dd);
		    };

		    this.getCityList = function() {
		   		var url = getAPIUrl() + "getlocation";
		    	return serverUtility.getWebService(url)
		    		.then(
		    			function(data){return data; },
		    			function(error){return error; }
		    		);
		   	};

		   	this.dynamicSort = function(property) {
	    	    var sortOrder = 1;
	    	    if(property[0] === "-") {
	    	        sortOrder = -1;
	    	        property = property.substr(1);
	    	    }
	    	    return function (a,b) {
	    	        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
	    	        return result * sortOrder;
	    	    }
	    	};		   	
		    
		    return this;
	    }
	]);	
});