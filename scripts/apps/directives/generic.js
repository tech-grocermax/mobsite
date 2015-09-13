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
});