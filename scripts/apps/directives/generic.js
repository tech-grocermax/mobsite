define(['app'], function(app){
	app.directive('outsideclick', function($document){
	    return {
	        restrict: 'A',
	        link: function(scope, elem, attr, ctrl) {
	            elem.bind('click', function(e) {
	                e.stopPropagation();
	            });
	            $document.bind('click', function(e) {
	            	scope.$apply(attr.outsideclick);                
	            });
	        }
	    };
	});

	app.directive('search', function($document){
	    return {
	    	require: 'ngModel',
	        link: function(scope, elem, attr, ctrl) {
	        	elem.bind('keyup', function(event) {
	        		var keycode = (event.which) ? event.which : event.keyCode;
	            	if(keycode == 13){
	            		console.log("enter");    
	            		scope.handleSearchKeyEnter();     		            		
	            	}
	            });            
	        }
	    };
	});
});