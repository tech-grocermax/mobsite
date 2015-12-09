define(['app'], function(app) {
	app.controller('userController',  [
        '$scope', '$rootScope', '$routeParams', '$location', '$timeout', 'userService', 'productService', 'utility', 
        function($scope, $rootScope, $routeParams, $location, $timeout, userService, productService, utility) {
            $scope.sectionName = $routeParams.sectionName;
            $scope.orderId = angular.isDefined($routeParams.orderId) ? $routeParams.orderId : null;
            
            if((angular.isUndefined(utility.getJStorageKey("userId")) 
                || !utility.getJStorageKey("userId"))
                && ($scope.sectionName == "profile" 
                    || $scope.sectionName == "editprofile"
                    || $scope.sectionName == "address"
                    || $scope.sectionName == "addaddress"
                    || $scope.sectionName == "editaddress"
                    || $scope.sectionName == "orderhistory")){
                $location.url("user/login");
            } else if(angular.isDefined(utility.getJStorageKey("userId")) 
                && utility.getJStorageKey("userId")
                && ($scope.sectionName == "login" || $scope.sectionName == "register")) {
                $location.url("user/profile");
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
                city: ($scope.isReferrer == 'checkout' && $scope.addressType == 'shipping') ? utility.getJStorageKey("selectedCity") : "",
                state: "",                
                pin: null,
                countrycode: "IN",                
                phone: null,                
                default_billing: false,
                default_shipping: false,
                cityid: 1
            };

            if($scope.isReferrer == 'checkout' && $scope.addressType == 'shipping') {
                $scope.stateName = utility.getJStorageKey("stateName");
                $scope.regionId = utility.getJStorageKey("regionId");
            } else {
                $scope.stateName = "";
                $scope.regionId = "";
            }
            $scope.registrationStep = 1;
            $scope.otp = "";
            /*$scope.cityLocation = {
                "delhi": angular.isDefined(utility.getJStorageKey("selectedCity")) && utility.getJStorageKey("selectedCity") == "delhi" ? true : false,
                "gurgaon": angular.isDefined(utility.getJStorageKey("selectedCity")) && utility.getJStorageKey("selectedCity") == "gurgaon" ? true : false,
                "noida": angular.isDefined(utility.getJStorageKey("selectedCity")) && utility.getJStorageKey("selectedCity") == "noida" ? true : false
            };*/
            $scope.email = null;
            $scope.locationList = [];            
            $scope.cartItemCount = 0;
            $scope.quoteId = angular.isDefined(utility.getJStorageKey("quoteId")) && utility.getJStorageKey("quoteId") ? utility.getJStorageKey("quoteId") : null;
            $scope.cityList = null;
            $scope.cityLocation = {};

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
            
            toggleLoader = function(flag) {
                $scope.displayLoader = flag;
            };

            getLocationList = function() {
                var cityId = utility.getJStorageKey("selectedCityId");
                userService.getLocationList(cityId)
                    .then(function(data){
                        $scope.locationList = data.locality;                                          
                    });
            };

            getStateList = function() {
                userService.getStateList()
                    .then(function(data){
                        $scope.stateList = data.state;      
                    });
            };            

            updateClassName = function(keyName) {
                angular.forEach($scope.className, function(value, key){
                    $scope.className[key] = false;
                });
                $scope.className[keyName] = true;
            };

            successCallbackUser = function(data, email) {
                toggleLoader(false);
                $scope.showUserResponse = true;
                if(data.flag == "1") {
                    utility.setJStorageKey("userId", data.UserID, 1);
                    utility.setJStorageKey("email", email, 1); 

                    var oldQuoteId = utility.getJStorageKey("quoteId")
                    utility.setJStorageKey("quoteId", data.QuoteId, 1);  
                    var oldCartCount = utility.getJStorageKey("cartCounter" + oldQuoteId);
                    utility.setJStorageKey("cartCounter" + data.QuoteId, oldCartCount, 1);

                    //cartCounterKey
                    /*var quoteId = utility.getJStorageKey("quoteId"),
                    cartCounterKey = "cartCounter" + quoteId,
                    cartCount = 0;*/ 

                    $scope.userResponseMessage = data.Result;
                    updateClassName("success");
                    if($scope.isReferrer == "checkout") {
                        $location.url("checkout/shipping"); 
                    } else {
                        $location.url("/");
                    }
                } else {
                    $scope.showUserResponse = true;
                    $scope.userResponseMessage = data.Result;
                    updateClassName("danger");
                }
            };                       

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
                toggleLoader(true);
                userService.getUserProfile(userId)
                    .then(function(data){
                        toggleLoader(false);
                        successCallbackProfile(data);
                    });
            };

            if(angular.isDefined(utility.getJStorageKey("userId")) 
                && utility.getJStorageKey("userId")
                && ($scope.sectionName == "profile" 
                    || $scope.sectionName == "editprofile")){
                $scope.isUserLoggedIn = true;
                getUserProfile(utility.getJStorageKey("userId"));
            }

            getCartItemDetails = function() {
                toggleLoader(true);
                productService.getCartItemDetails($scope.quoteId)
                    .then(function(data){ 
                        toggleLoader(false);             
                        $scope.cartDetails = data.CartDetail;                         
                        $scope.cartItemCount = productService.getCartItemCount($scope.cartDetails.items);             
                    });
            };

            getBasketItemCounter = function() {
                var quoteId = utility.getJStorageKey("quoteId"),
                    cartCounterKey = "cartCounter" + quoteId,
                    cartCount = 0;
                
                if(angular.isDefined(utility.getJStorageKey(cartCounterKey)) 
                    && utility.getJStorageKey(cartCounterKey) ) {
                    cartCount = utility.getJStorageKey(cartCounterKey);
                    $scope.cartItemCount = cartCount;
                }
            };   

            if($scope.quoteId){
                //getCartItemDetails(); 
                getBasketItemCounter();
            }   

            $scope.createUser = function(form) {
                $scope.errorRegistration = true;
                console.log(form.$valid);                
                if (form.$valid) {
                    toggleLoader(true);
                    utility.setJStorageKey("registrationDetails", $scope.user, 1);
                    userService.createUser($scope.user)
                        .then(function(data){
                            toggleLoader(false);
                            if(data.flag == 1){
                                $scope.showUserResponse = false;
                                $scope.userResponseMessage = "";
                                utility.setJStorageKey("otp", data.otp, 1);
                                $scope.registrationStep = 2;
                            } else {
                                $scope.showUserResponse = true;
                                $scope.userResponseMessage = data.Result;
                                updateClassName("danger");
                            }                            
                        });
                }
            };

            $scope.verifyOTP = function() { 
                console.log($scope.otp, utility.getJStorageKey("otp"));               
                if($scope.otp == utility.getJStorageKey("otp")) {
                    toggleLoader(true);
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
                    toggleLoader(true);
                    var input = {
                            uemail: $scope.user.uemail,
                            password: $scope.user.password
                        },
                        email = $scope.user.uemail;

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
                toggleLoader(false);
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

            $scope.updateProfile = function(form) {
                $scope.errorRegistration = true;
                console.log(form.$valid);                
                if (form.$valid) {
                    toggleLoader(true);
                    userService.updateProfile($scope.user, utility.getJStorageKey("userId"))
                        .then(function(data){
                            successCallbackUpdateProfile(data);
                        });
                }
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

            iterateAddressList = function() {
                angular.forEach($scope.addressList, function(value, key) {
                    value["isDisplay"] = true;
                });
            };

            getAddressList = function() {
                toggleLoader(true);
                userService.getAddressList(utility.getJStorageKey("userId"))
                    .then(function(data){
                        toggleLoader(false);
                        $scope.addressList = data.Address;
                        iterateAddressList();
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

            if($scope.sectionName == "addaddress" || $scope.sectionName == "editaddress") {           
                getLocationList();
                getStateList();
            }

            $scope.editAddress = function(addressId) {
                $location.url("user/editaddress?addressId=" + addressId);
            };
            
            $scope.deleteAddress = function(address) {
                var addressId = address.customer_address_id;
                toggleLoader(true);
                userService.deleteAddress(addressId)
                    .then(function(data){
                        toggleLoader(false);
                        address.isDisplay = false;                      
                    });
            };

            $scope.saveAddress = function(form) {
                $scope.errorRegistration = true;
                if (form.$valid) {
                    toggleLoader(true);
                    userService.saveAddress($scope.address, 
                        utility.getJStorageKey("userId"), $scope.addressId)
                            .then(function(data){
                                toggleLoader(false);
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
                toggleLoader(true);
                userService.getOrderHistory(utility.getJStorageKey("email"))
                    .then(function(data){
                        toggleLoader(false);
                        $scope.orderHistory = data.orderhistory;
                        if($scope.orderHistory.length) {
                            $scope.orderHistory.sort(utility.dynamicSort("-created_at"));
                        }                      
                    });
            };
            if($scope.sectionName == "orderhistory" && !$scope.orderId){
                getOrderHistory();
            }

            getOrderDetails = function() {
                toggleLoader(true);
                userService.getOrderDetails($scope.orderId)
                    .then(function(data){
                        toggleLoader(false);
                        $scope.orderDetails = data.OrderDetail;      
                        console.log($scope.orderDetails);                                       
                    });
            };
            if($scope.sectionName == "orderhistory" && $scope.orderId){
                getOrderDetails();
            }

            $scope.renderDeliveryDateTime = function(order) {
                if(angular.isDefined(order)) {                
                    return order[0].value + " " + order[0].value;
                }
            };

            var paymentMethodMapping = {
                paytm_cc: "Paytm",
                cashondelivery: "Cash On Delivery"
            };

            $scope.renderPaymentMethod = function(method) {
                console.log(method);
                if(angular.isDefined(method)) {
                    return paymentMethodMapping[method];
                }
            };

            $scope.renderShippingAddress = function(address) {
                if(angular.isDefined(address)) {
                   return (address.firstname + " " + address.lastname + " " +address.street + " " + address.city + " " + address.region + " " + address.postcode);
                }
            };

            $scope.toFixedDecimal = function(num) {
                if(angular.isDefined(num)) {
                    num = parseFloat(num);
                    return num.toFixed(2);
                }                
            };

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
                toggleLoader(false);
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

            $scope.forgotPassword = function(form) {
                $scope.errorRegistration = true;
                if(form.$valid) {
                    toggleLoader(true);
                    userService.forgotPassword($scope.email)
                        .then(function(data){
                               successCallbackForgotPassword(data);                    
                        });
                }                
            };

            $scope.changePassword = function(form) {
                console.log($scope.password);
                $scope.errorRegistration = true;
                console.log(form.$valid);                
                if (form.$valid) {
                    if($scope.password["old"].length < 6
                        || $scope.password["new"].length < 6
                        || $scope.password["confirm"].length < 6) {
                        $scope.showUserResponse = true;
                        $scope.userResponseMessage = "Please fill minimum length password";
                        updateClassName("danger");
                    } else if($scope.password["new"] == $scope.password["confirm"]) {
                        toggleLoader(true);
                        var input = {
                            userid:utility.getJStorageKey("userId"),
                            password:$scope.password["new"],
                            old_password:$scope.password["old"]
                        };
                        userService.changePassword(input)
                            .then(function(data){
                                toggleLoader(false);
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
                }
            };

            $scope.logout = function() {
                var userId = utility.getJStorageKey("userId");
                userService.logout(userId)
                    .then(function(data){
                        if(data.flag == "1") {
                            utility.deleteJStorageKey("userId");
                            utility.deleteJStorageKey("quoteId")
                            $location.url("user/login");
                        }                  
                    });
            };
            
            openCitySelectionModal = function() {
                $('#myModal').modal({
                    backdrop: false,
                    keyboard: false,
                    show: true
                });
            };

            getCityList = function() {
                toggleLoader(true);
                utility.getCityList()
                    .then(function(data){
                        $scope.cityList = data.location;
                        angular.forEach($scope.cityList, function(value, key) {
                            var city = value.city_name.toLowerCase();
                            $scope.cityLocation[city] = angular.isDefined(utility.getJStorageKey("selectedCity")) && utility.getJStorageKey("selectedCity") == city ? true : false;                            
                        });
                        openCitySelectionModal();
                        toggleLoader(false);
                    });
            };

            $scope.changeCity = function() {
                getCityList();
            };

            hideCitySelectionModal = function() {
                $('#myModal').modal('hide');
            };

            $scope.setCityLocation = function(location) {
                console.log(location);
                var city = location.city_name.toLowerCase(),
                    cityId = location.id;

                angular.forEach($scope.cityLocation, function(value, key){
                    $scope.cityLocation[key] = false;
                });
                $scope.cityLocation[city] = true;
                utility.setJStorageKey("selectedCity", city, 1);
                utility.setJStorageKey("selectedCityId", location.id, 1);
                utility.setJStorageKey("storeId", location.storeid, 1);
                utility.setJStorageKey("stateName", location.default_name, 1);
                utility.setJStorageKey("regionId", location.region_id, 1);
                hideCitySelectionModal();
            };

            $scope.getCityImgSrc = function(location) {
                if(angular.isDefined(location)) {
                    var city = location.city_name.toLowerCase();
                    return $scope.cityLocation[city] ? 'selected.png' : '-unselected.png';
                } else {
                    return '-unselected.png';
                }                
            };

            $scope.navigateToCart = function() {
                if(angular.isDefined(utility.getJStorageKey("quoteId")) 
                    && utility.getJStorageKey("quoteId")
                    && $scope.cartItemCount) {
                    $location.url("cart" + "/" + utility.getJStorageKey("quoteId"));
                } else {
                    console.log("ELSE");
                }
            };

            $scope.navigateToOrderDetail = function(order) {
                $location.url("user/orderhistory/" + order.order_id);
            };

            $scope.convertToInteger = function(qty) {
                return parseInt(qty, 10);
            };

            $scope.renderItemName1 = function(item) {
                if(item.name.indexOf('[') >= 0) {
                    var arrSplit = item.name.split('[');
                    return arrSplit[0];
                } else {
                    return item.name;
                }
            };

            $scope.renderItemName2 = function(item) {
                if(item.name.indexOf('[') >= 0) {
                    var arrSplit = item.name.split('[');
                    return "[" + arrSplit[1];
                } else {
                    return "";
                }
            };

            angular.element(document).ready(function () {
                if(angular.isUndefined(utility.getJStorageKey("selectedCity"))
                    || !utility.getJStorageKey("selectedCity")) {
                    getCityList();

                    $timeout(function() {
                        $("#e1").select2();                        
                    }, 2000);
                } 

                $timeout(function() {
                    $('form[autocomplete="off"] input, input[autocomplete="off"]').each(function(){
                        var input = this,
                            name = $(input).attr('name'),
                            id = $(input).attr('id');

                        $(input).removeAttr('name').removeAttr('id');
                        setTimeout(function(){ 
                            $(input).attr('name', name).attr('id', id);
                        }, 100);
                    });
                }, 100);
            });          

        }
    ]);
});