define(['app'], function(app) {
	app.controller('customerController',  [
        '$scope', '$rootScope', '$routeParams', '$location', 'customerService', 'utility', 
        function($scope, $rootScope, $routeParams, $location, customerService, utility) {
            
            $scope.sectionName = $routeParams.sectionName;          
        	$scope.showSearchBar = false;
            $scope.columnSize = 1;
            $scope.pageName = $routeParams.pageName;
            $scope.showSearchIcon = true;
            $scope.showMoreIcon = false;
            $scope.showUserResponse = false;
            $scope.userResponseMessage = "";
            $scope.className = {
                "success" : false,
                "info" : false,
                "warning" : false,
                "danger" : false
            };
            $scope.section = {
                "login" : false,
                "register" : false,
                "profile" : false
            };
            $scope.section[$scope.sectionName] = true

            $scope.user = {
                uemail: null,
                password: null,
                fname: null,
                lname: null,
                number: null
            };

            updateClassName = function(keyName) {
                angular.forEach($scope.className, function(value, key){
                    $scope.className[key] = false;
                });
                $scope.className[keyName] = true;
            };

            handleUserSuccessCallback = function(data) {
                $scope.showUserResponse = true;
                if(data.flag == "1") {
                    utility.setJStorageKey("userId", data.UserID, 1);
                    $scope.userResponseMessage = data.Result;
                    updateClassName("success");
                } else {
                    $scope.userResponseMessage = data.Result;
                    updateClassName("danger");
                }
                //{"Result":"User Register Successfully","UserID":"5167","flag":"1"}
            };

            console.log(utility.getJStorageKey("userId"));

            $scope.createUser = function() {
                console.log($scope.user);
                customerService.createUser($scope.user)
                    .then(function(data){
                        console.log(data);
                        handleUserSuccessCallback(data);
                    });
            };

            $scope.loginUser = function() {
                var input = {
                    uemail: $scope.user.uemail,
                    password: $scope.user.password
                };

                customerService.loginUser(input)
                    .then(function(data){
                        console.log(data);
                        handleUserSuccessCallback(data);
                    });
            };

        }
    ]);
});