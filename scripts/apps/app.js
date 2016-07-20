define([appURL + 'routes', appURL + 'services/dependency'], function(config, dependency) {
    var app = angular.module('app', ['ngRoute', 'dc.endlessScroll', 'angular-carousel', 'angulartics', 'angulartics.google.analytics','satellizer']);

    app.config([
        '$routeProvider',
        '$locationProvider',
        '$controllerProvider',
        '$compileProvider',
        '$filterProvider',
        '$provide',
        '$analyticsProvider',
        '$sceDelegateProvider',
        '$authProvider',

        function($routeProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $analyticsProvider, $sceDelegateProvider,$authProvider) {

            if(window["definedCDN"] && window["definedCDN"].length) {
                $sceDelegateProvider.resourceUrlWhitelist([
                    // Allow same origin resource loads.
                    'self',
                    // Allow loading from our assets domain.  Notice the difference between * and **.
                    (window["definedCDN"] + '/**')
                ]);
            }

            // Angularitics Section
            // Adding google analytics code, making sure the GA ID can be different 
            // according to enviornment. This added function getGoogleAnayticsID in config.js

            (function(i, s, o, g, r, a, m) {
                i['GoogleAnalyticsObject'] = r;
                i[r] = i[r] || function() {
                    (i[r].q = i[r].q || []).push(arguments)
                }, i[r].l = 1 * new Date();
                a = s.createElement(o),
                    m = s.getElementsByTagName(o)[0];
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m)
            })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
            ga('create', getGoogleAnayticsID(), {'cookieDomain': 'none'});

            // // Google tag manager
            // (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            // new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            // j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            // '//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            // })(window,document,'script','dataLayer','GTM-NSC39T');

            // Disabling automated page tracking as requested! - Need aliased names
            $analyticsProvider.virtualPageviews(false);

            app.controller = $controllerProvider.register;
            app.directive = $compileProvider.directive;
            app.filter = $filterProvider.register;
            app.factory = $provide.factory;
            app.service = $provide.service;

            $locationProvider.html5Mode(false);

            if (config.routes !== undefined) {
                angular.forEach(config.routes, function(route, path) {
                    $routeProvider.when(path, {
                        templateUrl: route.templateUrl,
                        resolve: dependency(route.dependencies)
                    });
                });
            }

            if (config.defaultRoutePaths !== undefined) {
                $routeProvider.otherwise({
                    redirectTo: config.defaultRoutePaths
                });
            }
        }
    ]);
    app.run([
        "$rootScope",
        "$location",
        "$analytics",

        function($rootScope, $location, $analytics) {
            
            $rootScope.$on("$routeChangeStart", function(event, next, current) {
                // Check if config exists and config has non empty routes, consideing config.routes is a non empty "OBJECT"
                if(typeof config !== "undefined" && typeof config.routes !== "undefined" && Object.keys(config.routes).length) {
                    var selectedRoute = false;
                    angular.forEach(config.routes, function(route, routePath) {
                        if(routePath == next.$$route.originalPath) {
                            selectedRoute = route;
                        }
                    });
                    
                    // Set false or to singular name if available
                    var desiredPageName = selectedRoute.singularName ? selectedRoute.singularName: false;

                    // Check for params
                    if(Object.keys(next.params).length && typeof selectedRoute.listName !== "undefined" && Object.keys(selectedRoute.listName).length) {
                        angular.forEach(Object.keys(next.params), function(paramName) {
                            var filteredPageName = false;
                            angular.forEach(Object.keys(selectedRoute.listName), function(value, key) {
                                if(value == next.params[paramName]) {
                                    filteredPageName = selectedRoute.listName[next.params[paramName]];
                                }
                            });
                            if(filteredPageName) {
                                desiredPageName = filteredPageName;
                            }
                        });
                    }
                    if(desiredPageName) {
                        $analytics.pageTrack(desiredPageName);
                    }

                    //console.log(matchedRoute);
                }
            });
        }
    ]);

    return app;
});
