define(['app'], function(app) {
	app.controller('userController',  [
        '$scope', '$rootScope', '$routeParams', '$location', '$timeout', 'userService', 'utility', 
        function($scope, $rootScope, $routeParams, $location, $timeout, userService, utility) {
            
            $scope.sectionName = $routeParams.sectionName; 
            $scope.addressId = angular.isDefined($routeParams.addressId) ? $routeParams.addressId : null;         
        	$scope.showSearchBar = false;
            $scope.columnSize = 1;
            $scope.pageName = $routeParams.pageName;
            $scope.showSearchIcon = true;
            $scope.showMoreIcon = false;
            $scope.showMoreMenuOptions = false;
            $scope.showUserMenuOptions = false;
            $scope.showUserResponse = false;
            $scope.userResponseMessage = "";
            $scope.isUserLoggedIn = false;

            $scope.className = {
                "success" : false,
                "info" : false,
                "warning" : false,
                "danger" : false
            };
            $scope.section = {
                "login" : false,
                "register" : false,
                "profile" : false,
                "editprofile": false,
                "address" : false,
                "addaddress" : false,
                "editaddress" : false,
                "orderhistory" : false
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
            $scope.addressList = [];
            $scope.address = null;
            $scope.orderHistory = null;

            $scope.address = {
                firstname: null,
                lastname: null,
                city: null,
                region: null,
                street: null,
                postcode: null,
                country_id: "IN",
                telephone: null,
                is_default_billing: false,
                is_default_shipping: false
            };        

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

            successCallbackUser = function(data) {
                $scope.showUserResponse = true;
                if(data.flag == "1") {
                    utility.setJStorageKey("userId", data.UserID, 1);
                    $scope.userResponseMessage = data.Result;
                    updateClassName("success");
                } else {
                    $scope.userResponseMessage = data.Result;
                    updateClassName("danger");
                }
            };

            $scope.createUser = function() {
                userService.createUser($scope.user)
                    .then(function(data){
                        successCallbackUser(data);
                    });
            };

            $scope.loginUser = function() {
                var input = {
                    uemail: $scope.user.uemail,
                    password: $scope.user.password
                };

                userService.loginUser(input)
                    .then(function(data){
                        successCallbackUser(data);
                    });
            };

            //utility.setJStorageKey("userId", 323, 1);

            syncModelData = function(data) {
                $scope.user.fname = data.firstname;
                $scope.user.lname = data.lastname;
                $scope.user.number = data.mobile;
                $scope.user.uemail = data.email;
            };

            successCallbackProfile = function(data) {
                $scope.userProfile.personalInfo = data["Personal Info"];
                $scope.userProfile.billingAddress = data.BillingAddress;
                $scope.userProfile.shippingAddress = data.ShippingAddress;
                if($scope.sectionName == "editprofile") {
                    syncModelData($scope.userProfile.personalInfo);
                }                
            };

            getUserProfile = function(userId) {
                userService.getUserProfile(userId)
                    .then(function(data){
                        successCallbackProfile(data);
                    });
            };

            if(angular.isDefined(utility.getJStorageKey("userId")) 
                && utility.getJStorageKey("userId")){
                $scope.isUserLoggedIn = true;
                getUserProfile(utility.getJStorageKey("userId"));
            }            

            $scope.showMoreMenu = function() {
                $scope.showUserMenuOptions = false;
                $scope.showMoreMenuOptions = $scope.showMoreMenuOptions ? false : true;
            };

            $scope.showUserMenu = function() {
                $scope.showMoreMenuOptions = false;
                $scope.showUserMenuOptions = $scope.showUserMenuOptions ? false : true;
            };

            $scope.navigateTo = function(route) {
                $location.url(route);
            };

            successCallbackUpdateProfile = function(data) {
                $scope.showUserResponse = true;
                if(data.flag == "1") {
                    $scope.userResponseMessage = data.Result;
                    updateClassName("success");
                    $timeout(function() {
                        $location.url("user/profile");
                    }, 1000);
                } else {
                    $scope.userResponseMessage = data.Result;
                    updateClassName("danger");
                }
            };

            $scope.updateProfile = function() {
                userService.updateProfile($scope.user, utility.getJStorageKey("userId"))
                    .then(function(data){
                        successCallbackUpdateProfile(data);
                    });
            };

            
            getAddressList = function() {
                userService.getAddressList(utility.getJStorageKey("userId"))
                    .then(function(data){
                        $scope.addressList = data.Address;
                        if($scope.addressId) {
                            $scope.address = userService.extractAddressById(data.Address, 
                                $scope.addressId);
                        }
                    });
            };
            
            if($scope.sectionName == "address" 
                || $scope.sectionName == "addaddress"
                || $scope.sectionName == "editaddress") {
                getAddressList(); 
            }            

            $scope.editAddress = function(addressId) {
                $location.url("user/editaddress?addressId=" + addressId);
            };

            $scope.saveAddress = function() {
                userService.saveAddress($scope.address, 
                    utility.getJStorageKey("userId"), $scope.addressId)
                    .then(function(data){
                        if(data.flag == 1 || data.flag == "1") {
                            $location.url('user/address');
                        }
                    });
            };

            var email ="sharan.radhakrishnan@outlook.com";
            getOrderHistory = function() {
                userService.getOrderHistory(email)
                    .then(function(data){
                        $scope.orderHistory = data.orderhistory;                        
                    });
            };
            if($scope.sectionName == "orderhistory"){
                getOrderHistory();
            }

        }
    ]);
});