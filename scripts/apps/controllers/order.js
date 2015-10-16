define(['app'], function(app) {
    app.controller('orderController',  [
        '$scope', '$rootScope', '$routeParams', '$location', '$timeout', 'utility', 
        function($scope, $rootScope, $routeParams, $location, $timeout, utility) {
            $scope.orderId = $routeParams.orderId;
            console.log($scope.orderId);
            
            $scope.navigateTo = function(route) {
                $location.url(route);
            };
            
            console.log(utility.getJStorageKey("checkoutDetails"));
            console.log(utility.getJStorageKey("cartItems"));
            console.log(utility.getJStorageKey("quoteId"));

        }
    ]);
});