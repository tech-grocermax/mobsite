define(['app'], function(app) {
    app.controller('checkoutController',  [
        '$scope', '$rootScope', '$routeParams', '$location', '$timeout', 'userService', 'productService', 'utility', 
        function($scope, $rootScope, $routeParams, $location, $timeout, userService, productService, utility) {
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
            $scope.cityLocation = {
                "delhi": false,
                "gurgaon": false,
                "noida": false
            };
            $scope.isUserLoggedIn = angular.isDefined(utility.getJStorageKey("userId")) && utility.getJStorageKey("userId") ? true : false;
            $scope.cartItems = [];
            $scope.cartItemCount = 0;
            $scope.quoteId = utility.getJStorageKey("quoteId");
            $scope.youSaved = 0;
            $scope.totalCartQty = 0;
            $scope.paymentMethod = null;
            $scope.payment = {
                cashondelivery: false,
                cc: false,
                sodexo: false,
                paytm_cc: false,
                mobikwik: false
            };           

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

            $scope.deliverySlots = null;
            successCallbackDeliverySlots = function(data) {
                $scope.deliverySlots = [];
                $scope.deliverySlotIndex = 0;                
                var dateList = [];
                angular.forEach(data, function(value, key){
                    if(dateList.indexOf(value.Date) == -1) {
                        dateList.push(value.Date);
                        $scope.deliverySlots.push({date: value.Date});
                    }
                });

                angular.forEach($scope.deliverySlots, function(value, key) {
                    value.timeSlots = null;
                    var timeslots = [];
                    angular.forEach(data, function(innerValue, innerKey){
                        if(innerValue.Date == value.date) {
                            timeslots.push(buildDeliverySlotObject(innerValue));
                        }
                    });
                    value.timeSlots = timeslots;
                });
                //console.log($scope.deliverySlots);
            };
            
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

            getCartItems = function() {                
                var cartItems = utility.getJStorageKey("cartItems");
                return cartItems.length ? cartItems : [];                
            };

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

            $scope.getPriceDifference = function(price, salePrice) {
                return  (price - salePrice);    
            };

            getYouSaveAmout = function() {
                var savedAmont = 0,
                    qty = 0;

                angular.forEach($scope.cartDetails.items, function(value, key) {
                    savedAmont = savedAmont + parseFloat($scope.getPriceDifference(value.mrp, value.price));
                    qty = qty + parseInt(value.qty);
                });
                $scope.youSaved = savedAmont;
                $scope.totalCartQty = qty;
            };
          
            getCartItemDetails = function() {
                productService.getCartItemDetails($scope.quoteId)
                    .then(function(data){              
                        $scope.cartDetails = data.CartDetail; 
                        getYouSaveAmout();
                    });
            };  

            if($location.url() == "/checkout/payment"){
                getCartItemDetails(); 
            }   

            if(angular.isDefined(utility.getJStorageKey("cartItems")) 
                && utility.getJStorageKey("cartItems")) {
                getCartDetails();
            }

            $scope.changePaymentMethod = function(paymentMethod, model) {
                angular.forEach($scope.payment, function(value, key){
                    $scope.payment[key] = false;
                });
                $scope.payment[paymentMethod] = true;
                $scope.paymentMethod = ($scope.payment.cc || $scope.payment.paytm_cc) ? "paytm_cc" : paymentMethod;                
            };

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

            $scope.selectedDeliveryDate = utility.getCurrentDate();
            $scope.selectedDeliveryTime = null;
            $scope.parentIndex = null;

            $scope.isDeliveryProceedEnabled = function() {
                return $scope.selectedDeliveryDate && $scope.selectedDeliveryTime
                    && $scope.parentIndex;
            };

            $scope.navigateToPayment = function() {
                var quoteId = utility.getJStorageKey("quoteId");
                var checkoutDetails = utility.getJStorageKey("checkoutDetails");

                checkoutDetails[quoteId]["deliveryDate"] = $scope.selectedDeliveryDate;
                checkoutDetails[quoteId]["deliveryTime"] = $scope.selectedDeliveryTime;

                utility.setJStorageKey("checkoutDetails", checkoutDetails, 1);
                $location.url("checkout/payment");
            };

            getSelectedDeliveryDate = function(currentIndex) {
                var deliveryDate = null;
                angular.forEach($scope.deliverySlots, function(value, key){
                    if(key == currentIndex) {
                        deliveryDate = value.date;
                    }
                });
                return deliveryDate;
            };

            $scope.getPreviousDaySlot = function(index) {
                if(index > 0) {                    
                    $scope.deliverySlotIndex = $scope.deliverySlotIndex - 1;       
                    $scope.selectedDeliveryDate = getSelectedDeliveryDate($scope.deliverySlotIndex);             
                }
            };

            $scope.getNextDaySlot = function(index) {
                if(index < $scope.deliverySlots.length -1) {                    
                    $scope.deliverySlotIndex = $scope.deliverySlotIndex + 1;
                    $scope.selectedDeliveryDate = getSelectedDeliveryDate($scope.deliverySlotIndex);
                }
            };

            $scope.renderDeliveryDate = function(deliveryDate) {
                return (utility.getCurrentDate() == deliveryDate) ? "Today" : deliveryDate;
            };

            $scope.setDeliveryTime = function(data, parentIndex) {
                if(data.available) {
                    $scope.selectedDeliveryTime = data.timeSlot;
                    $scope.parentIndex = parentIndex;
                }
                //console.log(parentIndex);
                //console.log($scope.selectedDeliveryTime);
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

            $scope.setCityLocation = function(city) {
                angular.forEach($scope.cityLocation, function(value, key){
                    $scope.cityLocation[key] = false;
                });
                $scope.cityLocation[city] = true;
                utility.setJStorageKey("selectedCity", city, 1);
                hideCitySelectionModal();
            };

            hidePaymentFailedModal = function() {
                $('#paymentFailed').modal('hide');
            };

            $scope.retryPayment = function() {
                hidePaymentFailedModal();
                $scope.placeOrder();
            };

            $scope.payViaCOD = function() {
                hidePaymentFailedModal();
                $scope.paymentMethod = "cashondelivery";
                $scope.placeOrder();
            };

            $scope.placeOrder = function() {
                var userId = utility.getJStorageKey("userId");
                var checkoutDetails = utility.getJStorageKey("checkoutDetails");
                //console.log(checkoutDetails);
                //console.log($scope.paymentMethod);
                
                userService.checkout(userId, $scope.quoteId, checkoutDetails, $scope.paymentMethod)
                    .then(function(data){              
                        if(data.flag == 1){
                            utility.deleteJStorageKey("checkoutDetails");
                            utility.deleteJStorageKey("cartItems");
                            utility.deleteJStorageKey("quoteId");
                            $location.url("payment/success/" + data.OrderID);
                        } else {
                            $('#paymentFailed').modal({
                                backdrop: false,
                                keyboard: false,
                                show: true
                            });
                        }
                    });
            };

            angular.element(document).ready(function () {
                if(angular.isUndefined(utility.getJStorageKey("selectedCity"))
                    || !utility.getJStorageKey("selectedCity")) {
                    openCitySelectionModal();
                }                  
            });

        }
    ]);
});