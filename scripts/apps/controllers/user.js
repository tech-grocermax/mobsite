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
            $scope.pageName = $routeParams.pageName;
            $scope.showSearchIcon = false;
            $scope.showMoreIcon = false;
            $scope.showMoreMenuOptions = false;
            $scope.showUserMenuOptions = false;
            $scope.showUserResponse = false;
            $scope.userResponseMessage = "";
            $scope.isUserLoggedIn = angular.isDefined(utility.getJStorageKey("userId")) && utility.getJStorageKey("userId") ? true : false;
            console.log("isLoggedin = " + $scope.isUserLoggedIn);
            $scope.className = {
                "success" : false,
                "info" : false,
                "warning" : false,
                "danger" : false
            };
            $scope.section = {
                "login" : false,
                "register" : false,
                "forgotpassword" : false,
                "changepassword": false,
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
                fname: null,
                lname: null,
                addressline1: null,
                addressline2: null,
                addressline3: null,
                city: "gurgaon",
                state: "HR",                
                pin: null,
                countrycode: "IN",                
                phone: null,                
                default_billing: false,
                default_shipping: false,
                cityid: 1
            };

            $scope.registrationStep = 1;
            $scope.otp = "";
            $scope.cityLocation = {
                "delhi": angular.isDefined(utility.getJStorageKey("selectedCity")) && utility.getJStorageKey("selectedCity") == "delhi" ? true : false,
                "gurgaon": angular.isDefined(utility.getJStorageKey("selectedCity")) && utility.getJStorageKey("selectedCity") == "gurgaon" ? true : false,
                "noida": angular.isDefined(utility.getJStorageKey("selectedCity")) && utility.getJStorageKey("selectedCity") == "noida" ? true : false
            };
            $scope.email = null;
            $scope.locationList = [];            
            $scope.cartItemCount = 0;

            if($scope.section.profile) {
                $scope.categoryName = "My Profile";
                $scope.columnSize = 10;
            } else if($scope.section.editprofile) {
                $scope.categoryName = "Edit My Profile";
                $scope.columnSize = 10;
            } else if ($scope.section.address) {
                $scope.categoryName = "My Address";
                $scope.columnSize = 10;
            } else if ($scope.section.addaddress) {
                $scope.categoryName = "Create Address";
                $scope.columnSize = 10;
            } else if ($scope.section.editaddress) {
                $scope.categoryName = "Edit Address";
                $scope.columnSize = 10;
            } else if ($scope.section.orderhistory) {
                $scope.categoryName = "Order History";
                $scope.columnSize = 10;
            } else if ($scope.section.forgotpassword || $scope.section.changepassword) {
                $scope.columnSize = 1;
                $scope.showSearchIcon = true;
            } else if ($scope.section.login) {
                $scope.columnSize = 0;
            } else if ($scope.section.register) {
                $scope.categoryName = "Register";
                $scope.columnSize = 10;
            } else {
                $scope.columnSize = 1;
            }
            
            getLocationList = function() {
                userService.getLocationList(1)
                    .then(function(data){
                        $scope.locationList = data.locality;                                          
                    });
            };
            getLocationList();

            hideCitySelectionModal = function() {
                $('#myModal').modal('hide');
            };

            updateClassName = function(keyName) {
                angular.forEach($scope.className, function(value, key){
                    $scope.className[key] = false;
                });
                $scope.className[keyName] = true;
            };

            successCallbackUser = function(data, email) {
                $scope.showUserResponse = true;
                if(data.flag == "1") {
                    utility.setJStorageKey("userId", data.UserID, 1);
                    utility.setJStorageKey("email", email, 1);

                    console.log(utility.getJStorageKey("email"));
                    $scope.userResponseMessage = data.Result;
                    updateClassName("success");

                    if($scope.isReferrer == "checkout") {
                        $location.url("checkout/shipping"); 
                    } else {
                        $location.url("user/profile");
                    }
                } else {
                    $scope.showUserResponse = true;
                    $scope.userResponseMessage = data.Result;
                    updateClassName("danger");
                }
            };

            if($scope.section.register){
                //utility.setJStorageKey("otp", 1234, 1);
            }            

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

            getCartItemCounter = function() {
                var count = 0;
                angular.forEach($scope.cartItems, function(value, key){
                    count = count + parseInt(value.quantity, 10);
                });
                return count;
            };

            getCartDetails = function() {
                $scope.cartItems = getCartItems();
                $scope.cartItemCount = getCartItemCounter();                
            };
            if(angular.isDefined(utility.getJStorageKey("cartItems")) 
                && utility.getJStorageKey("cartItems")) {
                getCartDetails();
            }   

            $scope.createUser = function(form) {
                $scope.errorRegistration = true;
                console.log(form.$valid);
                if (form.$valid) {
                    utility.setJStorageKey("registrationDetails", $scope.user, 1);
                    userService.createUser($scope.user)
                        .then(function(data){
                            utility.setJStorageKey("otp", data.otp, 1);
                            $scope.registrationStep = 2;
                            //$scope.otp = data.otp; 
                        });
                }
            };

            $scope.verifyOTP = function() { 
                console.log($scope.otp, utility.getJStorageKey("otp"));               
                if($scope.otp == utility.getJStorageKey("otp")) {
                    angular.copy($scope.user, utility.getJStorageKey("registrationDetails"));
                    var email = $scope.user.uemail;
                    $scope.user.otp = 1;
                    userService.createUser($scope.user)
                        .then(function(data){
                            if(data.flag == 1){
                                utility.deleteJStorageKey("otp");
                                utility.deleteJStorageKey("registrationDetails");
                                successCallbackUser(data, email);
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

            $scope.loginUser = function(form) {
                $scope.errorLogin = true;
                if (form.$valid) { 
                    var input = {
                        uemail: $scope.user.uemail,
                        password: $scope.user.password
                    };

                    var email = $scope.user.uemail;

                    if(angular.isDefined(utility.getJStorageKey("quoteId")) 
                    && utility.getJStorageKey("quoteId")) {
                        input.quote_id = utility.getJStorageKey("quoteId");
                    }

                    userService.loginUser(input)
                        .then(function(data){
                            successCallbackUser(data, email);
                        });
                }
            };         

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

            rebuildAddressObject = function(address) {
                var arrStreet = address.street.split("\n");
                return {
                    fname : address.firstname,
                    lname : address.lastname,
                    addressline1 : arrStreet[0],
                    addressline2 : arrStreet[1],
                    addressline3 : arrStreet[2],
                    city : address.city,
                    state : address.region,
                    pin : address.postcode,
                    countrycode : address.country_id,
                    phone : address.telephone,
                    default_billing : address.is_default_billing ? 1 : 0,
                    default_shipping : address.is_default_shipping ? 1 : 0
                };
            };

            getAddressList = function() {
                userService.getAddressList(utility.getJStorageKey("userId"))
                    .then(function(data){
                        $scope.addressList = data.Address;
                        if($scope.addressId) {
                            var address = userService.extractAddressById(data.Address, 
                                $scope.addressId);
                            $scope.address = rebuildAddressObject(address);
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

            $scope.saveAddress = function(form) {
                //console.log($scope.address);

                $scope.errorRegistration = true;
                console.log(form.$valid);
                if (form.$valid) {
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
                }
            };

            var email =utility.getJStorageKey("email");
            getOrderHistory = function() {
                userService.getOrderHistory(utility.getJStorageKey("email"))
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

            $scope.password = {
                "old": null,
                "new": null,
                "confirm": null
            };

            $scope.changePassword = function(keyName, model) {
                $scope.password[keyName] = model;
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

            $scope.changePassword = function() {
                console.log($scope.password);
                if(!$scope.password["old"]
                    || !$scope.password["new"]
                    || !$scope.password["confirm"]) {
                    $scope.showUserResponse = true;
                    $scope.userResponseMessage = "Please fill missing fields first";
                    updateClassName("danger");
                } else if($scope.password["new"] == $scope.password["confirm"]) {
                    var input = {
                        userid:utility.getJStorageKey("userId"),
                        password:$scope.password["new"],
                        old_password:$scope.password["old"]
                    };
                    userService.changePassword(input)
                        .then(function(data){
                            if(data.flag == "1") {
                                $location.url("user/profile");
                            } else {
                                $scope.showUserResponse = true;
                                $scope.userResponseMessage = data.Result;
                                updateClassName("danger");
                            }                   
                        });
                } else {
                    $scope.showUserResponse = true;
                    $scope.userResponseMessage = "New & conirm password mismatch";
                    updateClassName("danger");
                }
            };

            $scope.openCitySelectionModal = function() {
                $timeout(function(){
                    $('#myModal').modal({
                        backdrop: false,
                        keyboard: false,
                        show: true
                    });
                }, 1000);
            };

            $scope.setCityLocation = function(city) {
                angular.forEach($scope.cityLocation, function(value, key){
                    $scope.cityLocation[key] = false;
                });
                $scope.cityLocation[city] = true;
                utility.setJStorageKey("selectedCity", city, 1);
                hideCitySelectionModal();
            };

            $scope.logout = function() {
                var userId = utility.getJStorageKey("userId");
                userService.logout(userId)
                    .then(function(data){
                        if(data.flag == "1") {
                            utility.deleteJStorageKey("userId");
                            $location.url("user/login");
                        }                  
                    });
            };

            angular.element(document).ready(function () {
                if(angular.isUndefined(utility.getJStorageKey("selectedCity"))
                    || !utility.getJStorageKey("selectedCity")) {
                    $scope.openCitySelectionModal();
                }  

                $timeout(function() {
                    $("#e1").select2();
                }, 2000);
            });           

        }
    ]);
});