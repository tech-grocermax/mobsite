define(['app'], function(app) {
	app.controller('userController',  [
        '$scope', '$rootScope', '$routeParams', '$location', 'userService', 'utility', 
        function($scope, $rootScope, $routeParams, $location, userService, utility) {
            
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

            $scope.password = {
                caption: "Show",
                type: "password"
            };
            $scope.userProfile = {};

            $scope.togglePasswordField = function() {
                console.log("togglePasswordField");
                $scope.password.type == "password" ? "text" : "password";
                $scope.password.caption == "Show" ? "Hide" : "Show";
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
                userService.createUser($scope.user)
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

                userService.loginUser(input)
                    .then(function(data){
                        console.log(data);
                        handleUserSuccessCallback(data);
                    });
            };

            utility.setJStorageKey("userId", 323, 1);

            $scope.getUserProfile = function(userId) {
                userService.getUserProfile(userId)
                    .then(function(data){
                        //console.log(data);
                        //$scope.userProfile.personalInfo = data.Personal Info;
                        $scope.userProfile.personalInfo = userService.samplePersonalInfo();
                        $scope.userProfile.billingAddress = data.BillingAddress;
                        $scope.userProfile.shippingAddress = data.ShippingAddress;
                        console.log($scope.userProfile.personalInfo);
                    });
            };
            $scope.getUserProfile(utility.getJStorageKey("userId"));

        }
    ]);
});