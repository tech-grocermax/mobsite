define(['app'], function(app) {
	app.controller('userController',  [
        '$scope', '$rootScope', '$routeParams', '$location', '$timeout', 'userService', 'utility', 
        function($scope, $rootScope, $routeParams, $location, $timeout, userService, utility) {
            $scope.sectionName = $routeParams.sectionName;

            if((angular.isUndefined(utility.getJStorageKey("userId")) 
                || !utility.getJStorageKey("userId"))
                && ($scope.sectionName == "profile" 
                    || $scope.sectionName == "editprofile"
                    || $scope.sectionName == "address"
                    || $scope.sectionName == "addaddress"
                    || $scope.sectionName == "editaddress"
                    || $scope.sectionName == "orderhistory")){
                $location.url("user/login");
            }

            $scope.addressId = angular.isDefined($routeParams.addressId) ? $routeParams.addressId : null;         
            $scope.isReferrer = angular.isDefined($routeParams.isReferrer) ? $routeParams.isReferrer : null;
            $scope.addressType = angular.isDefined($routeParams.addressType) ? $routeParams.addressType : null;
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
                "forgot" : false,
                "profile" : false,
                "editprofile": false,
                "address" : false,
                "addaddress" : false,
                "editaddress" : false,
                "orderhistory" : false
            };
            $scope.section[$scope.sectionName] = true;
            $scope.user = {
                uemail: null,
                password: null,
                fname: null,
                lname: null,
                number: null,
                otp: 0
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
                city: "Gurgaon",
                region: "Haryana",
                street: null,
                postcode: null,
                country_id: "IN",
                telephone: null,
                is_default_billing: false,
                is_default_shipping: false
            };
            $scope.registrationStep = 2;
            $scope.otp = angular.isDefined(utility.getJStorageKey("otp")) ? utility.getJStorageKey("otp") : "";
            $scope.cityLocation = {
                "delhi": false,
                "gurgaon": false,
                "noida": false
            };
            $scope.email = null;

            openCitySelectionModal = function() {
                $timeout(function(){
                    $('#myModal').modal({
                        backdrop: false,
                        keyboard: false,
                        show: true
                    });
                }, 1000);
            };

            hideCitySelectionModal = function() {
                $('#myModal').modal('hide');
            };

            angular.element(document).ready(function () {
                if(angular.isUndefined(utility.getJStorageKey("selectedCity"))
                    || !utility.getJStorageKey("selectedCity")) {
                    openCitySelectionModal();
                }                  
            });     

            $scope.setCityLocation = function(city) {
                angular.forEach($scope.cityLocation, function(value, key){
                    $scope.cityLocation[key] = false;
                });
                $scope.cityLocation[city] = true;
                utility.setJStorageKey("selectedCity", city, 1);
                hideCitySelectionModal();
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

                if($scope.isReferrer == "checkout") {
                    $location.url("checkout/shipping"); 
                }
            };

            if($scope.section.register){
                utility.setJStorageKey("otp", 1234, 1);
                var opt = utility.getJStorageKey("otp");
                console.log(opt);
                $scope.otp = opt;
            }

            $scope.createUser = function() {
                utility.setJStorageKey("registrationDetails", $scope.user, 1);
                userService.createUser($scope.user)
                    .then(function(data){
                        utility.setJStorageKey("otp", data.otp, 1);
                        $scope.registrationStep = 2;
                        $scope.otp = data.otp; 
                    });
            };

            $scope.verifyOTP = function() { 
                console.log($scope.otp, utility.getJStorageKey("otp"));               
                if($scope.otp == utility.getJStorageKey("otp")) {
                    angular.copy($scope.user, utility.getJStorageKey("registrationDetails"));
                    $scope.user.otp = 1;
                    userService.createUser($scope.user)
                        .then(function(data){
                            if(data.flag == 1){
                                utility.deleteJStorageKey("otp");
                                utility.deleteJStorageKey("registrationDetails");
                                successCallbackUser(data);
                            }                                                                           
                        });
                } else {
                    console.log("here");
                    $scope.showUserResponse = true;
                    $scope.userResponseMessage = "Invalid OTP, Please try again.";
                    updateClassName("danger");
                }
            };

            $scope.changeOTP = function(model) {
                $scope.otp = model;
            };

            $scope.loginUser = function() {
                var input = {
                    uemail: $scope.user.uemail,
                    password: $scope.user.password
                };

                if(angular.isDefined(utility.getJStorageKey("quoteId")) 
                && utility.getJStorageKey("quoteId")) {
                    input.quote_id = utility.getJStorageKey("quoteId");
                }

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
                            if($scope.isReferrer == "checkout") {
                                //$scope.address will be either shipping or billing
                                $location.url("checkout/" + $scope.addressType); 
                            } else {
                                $location.url('user/address');
                            }
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

            $scope.togglePasswordField = function() {
                $scope.password.type == "password" ? "text" : "password";
                $scope.password.caption == "Show" ? "Hide" : "Show";
            };

            $scope.handleOutSideClick = function() {
                $scope.showUserMenuOptions = false;
                $scope.showMoreMenuOptions = false;
                //$scope.showCategoryMenu = false;
                //$scope.showSubCategoryMenu = false;
            };

            $scope.navigateTo = function(route) {
                $location.url(route);
            };

            $scope.changeForgotPassword = function(model) {
                $scope.email = model;
            };

            successCallbackForgotPassword = function(data) {
                $scope.showUserResponse = true;
                if(data.flag == "1") {
                    $scope.userResponseMessage = data.Result;
                    updateClassName("success");
                    $timeout(function() {
                        $location.url("user/login");
                    }, 1000);
                } else {
                    $scope.userResponseMessage = data.Result;
                    updateClassName("danger");
                }
            };

            $scope.forgotPassword = function() {
                userService.forgotPassword($scope.email)
                    .then(function(data){
                           successCallbackForgotPassword(data);                    
                    });
            };

        }
    ]);
});