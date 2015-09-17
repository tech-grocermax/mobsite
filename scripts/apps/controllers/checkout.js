define(['app'], function(app) {
    app.controller('checkoutController',  [
        '$scope', '$rootScope', '$routeParams', '$location', '$timeout', 'userService', 'utility', 
        function($scope, $rootScope, $routeParams, $location, $timeout, userService, utility) {
            $scope.sectionName = $routeParams.sectionName;

            if((angular.isUndefined(utility.getJStorageKey("userId")) 
                || !utility.getJStorageKey("userId"))
                && ($scope.sectionName == "shipping" 
                    || $scope.sectionName == "biling"
                    || $scope.sectionName == "delivery"
                    || $scope.sectionName == "payment")){
                $location.url("user/login?isReferrer=checkout");
            }

            $scope.showSearchBar = false;
            $scope.columnSize = 1;
            $scope.showSearchIcon = true;
            $scope.showMoreIcon = false;
            $scope.showMoreMenuOptions = false;
            $scope.showUserMenuOptions = false;
            $scope.showUserResponse = false;
            $scope.isUserLoggedIn = false;            
            $scope.section = {
                "shipping" : false,
                "biling" : false,
                "delivery" : false,
                "payment": false
            };
            $scope.section[$scope.sectionName] = true;
            $scope.addressList = [];
            $scope.billingAsShipping = false;

            getAddressList = function() {
                userService.getAddressList(utility.getJStorageKey("userId"))
                    .then(function(data){
                        if(data.flag == "0"){
                            $scope.addressList = [];
                        } else {
                            $scope.addressList = data.Address;
                        }                        
                    });
            };

            buildDeliverySlotObject = function(value) {
                return {
                    timeSlot: value.TimeSlot,
                    available: value.Available
                };
            };

            successCallbackDeliverySlots = function(data) {
                $scope.deliverySlots = {};                
                var dateList = [];
                angular.forEach(data, function(value, key){
                    if(dateList.length && dateList.indexOf(value.Date) >= 0) {                        
                        $scope.deliverySlots[value.Date].push(buildDeliverySlotObject(value));
                    } else {
                        dateList.push(value.Date);
                        $scope.deliverySlots[value.Date] = [];                        
                        $scope.deliverySlots[value.Date].push(buildDeliverySlotObject(value));
                    }
                });
                console.log($scope.deliverySlots);
            };

            $scope.deliverySlots = null;
            getDeliverySlots = function() {
                userService.getDeliverySlots(utility.getJStorageKey("userId"))
                    .then(function(data){
                        if(data.flag == 1){
                            successCallbackDeliverySlots(data.Shipping);                            
                        }                        
                    });
            };
            getDeliverySlots();
            
            if($scope.sectionName == "shipping" 
                || $scope.sectionName == "billing") {
                getAddressList(); 
            }

            $scope.editAddress = function(addressId, addressType) {
                $location.url("user/editaddress?addressId=" + addressId 
                    + "&isReferrer=checkout&addressType=" + addressType);
            };  

            $scope.isSelectButtonDisabled = function(keyName) {
                var isDisabled = true;
                if($scope.addressList.length) {
                    angular.forEach($scope.addressList, function(value, key) {
                        if(value[keyName]) {
                            isDisabled = false;
                        }
                    });
                }
                return isDisabled;
            };

            $scope.changeDefaultSelection = function(address, keyName) {
                console.log("here");
                angular.forEach($scope.addressList, function(value, key) {
                   value[keyName] = false;                    
                });
                address[keyName] = true;
            };

            //console.log(utility.getJStorageKey("checkoutDetails"));
            //console.log(utility.getJStorageKey("userId"));

            $scope.selectShippingAddress = function() {
                var shippingAddress = null,
                    billingAddress = null;

                if($scope.addressList.length) {
                    angular.forEach($scope.addressList, function(value, key) {
                        if(value.is_default_shipping) {
                            shippingAddress = value;
                        }
                    });
                }                
                
                console.log(shippingAddress);
                console.log(billingAddress);

                var quoteId = utility.getJStorageKey("quoteId"),
                    checkoutDetails = {};

                checkoutDetails[quoteId] = {};
                checkoutDetails[quoteId].shippingAddress = shippingAddress;
                
                if($scope.billingAsShipping) {
                    billingAddress = shippingAddress;
                    checkoutDetails[quoteId].billingAddress = billingAddress;
                }
                utility.setJStorageKey("checkoutDetails", checkoutDetails, 1);

                if($scope.billingAsShipping) {
                    $location.url("checkout/delivery");
                } else {
                    $location.url("checkout/billing");
                }
            };

            $scope.selectBillingAddress = function() {
                var billingAddress = null;
                if($scope.addressList.length) {
                    angular.forEach($scope.addressList, function(value, key) {
                        if(value.is_default_billing) {
                            billingAddress = value;
                        }
                    });
                }
                
                console.log(billingAddress);
                var quoteId = utility.getJStorageKey("quoteId");
                var checkoutDetails = utility.getJStorageKey("checkoutDetails");

                checkoutDetails[quoteId].billingAddress = billingAddress;                
                utility.setJStorageKey("checkoutDetails", checkoutDetails, 1);
                $location.url("checkout/delivery");                
            };  

            $scope.setBillingAsShipping = function(model) {
                $scope.billingAsShipping = model;
            };  

            $scope.showMoreMenu = function() {
                $scope.showUserMenuOptions = false;
                $scope.showMoreMenuOptions = $scope.showMoreMenuOptions ? false : true;
            };

            $scope.showUserMenu = function() {
                $scope.showMoreMenuOptions = false;
                $scope.showUserMenuOptions = $scope.showUserMenuOptions ? false : true;
            };                     

            $scope.handleOutSideClick = function() {
                $scope.showUserMenuOptions = false;
                $scope.showMoreMenuOptions = false;
            };

            $scope.navigateTo = function(route) {
                $location.url(route);
            }; 

        }
    ]);
});