define(['app'], function(app) {
    app.controller('orderController',  [
        '$scope', '$rootScope', '$routeParams', '$location', '$timeout', 'utility', 
        function($scope, $rootScope, $routeParams, $location, $timeout, utility) {
            $scope.orderId = $routeParams.orderId;           
            $scope.navigateTo = function(route) {
                $location.url(route);
            };
        }
    ]);
});