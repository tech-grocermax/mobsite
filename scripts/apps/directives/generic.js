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

	app.directive('search', [
		'$document', '$location', '$timeout',
		function($document, $location, $timeout){
		    return {
		    	require: 'ngModel',
		        link: function(scope, elem, attr, ctrl) {
		        	elem.bind('keyup', function(event) {
		        		var keycode = (event.which) ? event.which : event.keyCode;
		            	if(keycode == 13 && elem.val().length >= 3){
		            		console.log("enter");  
		            		console.log(elem.val());  
		            		scope.handleSearchKeyEnter();		            				            		   		            		
		            	}
		            });            
		        }
		    };
		}
	]);

	app.directive('searchBtn', [
		'$document', '$location', '$timeout',
		function($document, $location, $timeout){
		    return {
		    	link: function(scope, elem, attr, ctrl) {
		        	elem.bind('click', function(event) {
		            	if(angular.element(".search-bar").val().length > 2){		            		
		            		scope.handleSearchKeyEnter();		            				            		   		            		
		            	}
		            });            
		        }
		    };
		}
	]);

	app.directive('back', ['$window', function($window) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                elem.bind('click', function () {
                    $window.history.back();
                });
            }
        };
    }]);
});