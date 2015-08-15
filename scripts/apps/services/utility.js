define(['app'], function (app) {
    app.service('utility', function ($http) {
	    'use strict';	    
    
	    this.getJStorageKey = function(key) {
	    	return $.jStorage.get(key);
	    };	

	    this.setJStorageKey = function(key, value, time) {
	    	time = angular.isDefined(time) ? time : 1;
	    	$.jStorage.set(key, value);
			$.jStorage.setTTL(key, time * 3600 * 1000);
	    };

	    this.deleteJStorageKey = function(key) {
	    	$.jStorage.deleteKey(key);
	    };
	    
	    return this;
    });
});