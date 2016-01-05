define(['app'], function(app) {
    app.controller('orderController',  [
        '$scope', '$rootScope', '$routeParams', '$location', '$timeout', 'utility', 
        function($scope, $rootScope, $routeParams, $location, $timeout, utility) {
            $scope.orderId = $routeParams.orderId;  
            $scope.orderStatus = angular.isDefined($routeParams.status) ? $routeParams.status : null;         
            $scope.navigateTo = function(route) {
                $location.url(route);
            };
        }
    ]);
});