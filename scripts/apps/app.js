define([appURL+'routes',appURL+'services/dependency'], function(config, dependency) {
    var app = angular.module('app', ['ngRoute', 'dc.endlessScroll']);

    app.config( [
        '$routeProvider',
        '$locationProvider',
        '$controllerProvider',
        '$compileProvider',
        '$filterProvider',
        '$provide',

        function($routeProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {
	        app.controller = $controllerProvider.register;
	        app.directive  = $compileProvider.directive;
	        app.filter     = $filterProvider.register;
	        app.factory    = $provide.factory;
	        app.service    = $provide.service;

            $locationProvider.html5Mode(false);

            if(config.routes !== undefined) {
                angular.forEach(config.routes, function(route, path) {
                    $routeProvider.when(path, {
                        templateUrl:route.templateUrl, 
                        resolve:dependency(route.dependencies)
                    });
                });
            }

            if(config.defaultRoutePaths !== undefined) {
                $routeProvider.otherwise({redirectTo:config.defaultRoutePaths});
            }
        }
    ]);

   return app;
});