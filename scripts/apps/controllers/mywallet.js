define(['app'], function(app) {
    app.controller('mywalletController',  [
         '$scope', '$rootScope', '$location', '$q', '$timeout', '$routeParams', 'utility', '$analytics', 'mywalletService',
        function($scope, $rootScope, $location, $q, $timeout, $routeParams, utility, $analytics, mywalletService){
			
			$scope.custId = utility.getJStorageKey("userId");
			
			console.log($scope.custId);
			var getWalletAmount = function(callback){
				mywalletService.getWalletAmount($scope.custId)
				.then(function(data){					
					$scope.walletDetails = data;
                });
			};
			getWalletAmount();
			
			$scope.getbalance = function (){
				var payment = $scope.walletDetails.payment;
			}
			
		}
    ]);
});