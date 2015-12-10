define(['app'], function(app) {
    app.controller('checkoutController',  [
        '$scope', '$rootScope', '$routeParams', '$location', '$timeout', 'userService', 'productService', 'utility', 
        function($scope, $rootScope, $routeParams, $location, $timeout, userService, productService, utility) {
            $scope.sectionName = $routeParams.sectionName;

            if((angular.isUndefined(utility.getJStorageKey("userId")) 
                || !utility.getJStorageKey("userId"))
                && ($scope.sectionName == "shipping" 
                    || $scope.sectionName == "billing"
                    || $scope.sectionName == "delivery"
                    || $scope.sectionName == "payment")){
                $location.url("user/login?isReferrer=checkout");
            }

            $scope.showSearchBar = false;
            $scope.columnSize = 0;
            $scope.showSearchIcon = false;
            $scope.showMoreIcon = false;
            $scope.hideCartIcon = true;
            $scope.showMoreMenuOptions = false;
            $scope.showUserMenuOptions = false;
            $scope.showUserResponse = false;
            $scope.isUserLoggedIn = false;            
            $scope.section = {
                "shipping" : false,
                "billing" : false,
                "delivery" : false,
                "payment": false
            };
            $scope.section[$scope.sectionName] = true;
            $scope.addressList = [];
            $scope.billingAsShipping = false;
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
            $scope.cityList = null;
            $scope.cityLocation = {};
            $scope.shouldProceed = true;

            toggleLoader = function(flag) {
                $scope.displayLoader = flag;
            };  

            if($scope.section.shipping) {
                $scope.categoryName = "Select Shipping Address";
                $scope.columnSize = 10;
            } else if($scope.section.billing) {
                console.log("here");
                $scope.categoryName = "Select Billing Address";
                $scope.columnSize = 10;
            } else if ($scope.section.delivery) {
                $scope.categoryName = "Select Delivery Details";
                $scope.columnSize = 10;
            } else if ($scope.section.payment) {
                $scope.categoryName = "Select Payment Method";
                $scope.columnSize = 10;
            }

            var refineShippingAddress = function() {
                var shippingAddress = [],
                    regionId = utility.getJStorageKey("regionId");
                
                angular.forEach($scope.addressList, function(value, key){
                    if(value.region_id == regionId) {
                        shippingAddress.push(value);
                    }
                });
                $scope.addressList = [];
                $scope.addressList = shippingAddress;
            };

            var refineBillingAddress = function() {
                var billingAddress = [];
                
                angular.forEach($scope.addressList, function(value, key){
                    if(value.is_default_shipping) {
                        billingAddress.push(value);
                    }
                });
                $scope.addressList = [];
                $scope.addressList = billingAddress;
            };

            getAddressList = function() {
                toggleLoader(true);
                userService.getAddressList(utility.getJStorageKey("userId"))
                    .then(function(data){
                        toggleLoader(false);
                        if(data.flag == "0"){
                            $scope.addressList = [];
                        } else {
                            $scope.addressList = data.Address;
                            if($scope.sectionName == "shipping") {
                                refineShippingAddress();
                            } else if($scope.sectionName == "billing"){
                                refineBillingAddress();
                            }
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
                toggleLoader(true);
                userService.getDeliverySlots(utility.getJStorageKey("userId"))
                    .then(function(data){
                        toggleLoader(false);
                        if(data.flag == 1){
                            successCallbackDeliverySlots(data.Shipping);                            
                        }                        
                    });
            };
            if($scope.sectionName == "delivery") {
                getDeliverySlots();
            }            
            
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
                toggleLoader(true);
                productService.getCartItemDetails($scope.quoteId)
                    .then(function(data){  
                        toggleLoader(false);            
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
            
            $scope.selectShippingAddress = function() {
                if($scope.isSelectButtonDisabled('is_default_shipping')) {
                    $scope.shouldProceed = false;
                    return false;
                }
                $scope.shouldProceed = true;
                var shippingAddress = null,
                    billingAddress = null;

                if($scope.addressList.length) {
                    angular.forEach($scope.addressList, function(value, key) {
                        if(value.is_default_shipping) {
                            shippingAddress = value;
                        }
                    });
                }                
                
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
                if($scope.isSelectButtonDisabled('is_default_billing')) {
                    $scope.shouldProceed = false;
                    return false;
                }
                $scope.shouldProceed = true;

                var billingAddress = null;
                if($scope.addressList.length) {
                    angular.forEach($scope.addressList, function(value, key) {
                        if(value.is_default_billing) {
                            billingAddress = value;
                        }
                    });
                }                
                
                var quoteId = utility.getJStorageKey("quoteId"),
                    checkoutDetails = utility.getJStorageKey("checkoutDetails");

                checkoutDetails[quoteId].billingAddress = billingAddress;                
                utility.setJStorageKey("checkoutDetails", checkoutDetails, 1);
                $location.url("checkout/delivery");                
            };  

            $scope.setBillingAsShipping = function(model) {
                $scope.billingAsShipping = model;
            };  

            //$scope.selectedDeliveryDate = utility.getCurrentDate();
            $scope.selectedDeliveryTime = null;
            $scope.parentIndex = null;

            $scope.isDeliveryProceedEnabled = function() {
                return $scope.selectedDeliveryDate && $scope.selectedDeliveryTime
                    && $scope.parentIndex;
            };

            $scope.isClicked = false;
            $scope.navigateToPayment = function() {
                $scope.isClicked = true;
                if(!$scope.isDeliveryProceedEnabled()) {
                    $scope.shouldProceed = false;
                    return false;
                }
                $scope.shouldProceed = true;

                var quoteId = utility.getJStorageKey("quoteId"),
                    checkoutDetails = utility.getJStorageKey("checkoutDetails");

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
                    //$scope.selectedDeliveryDate = getSelectedDeliveryDate($scope.deliverySlotIndex);             
                }
            };

            $scope.getNextDaySlot = function(index) {
                if(index < $scope.deliverySlots.length -1) {                    
                    $scope.deliverySlotIndex = $scope.deliverySlotIndex + 1;
                    //$scope.selectedDeliveryDate = getSelectedDeliveryDate($scope.deliverySlotIndex);
                }
            };

            $scope.renderDeliveryDate = function(deliveryDate) {
                return (utility.getCurrentDate() == deliveryDate) ? "Today" : deliveryDate;
            };

            $scope.setDeliveryTime = function(data, parentIndex) {
                console.log(data);
                console.log(parentIndex);
                if(data.available) {
                    $scope.selectedDeliveryTime = data.timeSlot;
                    $scope.selectedDeliveryDate = getSelectedDeliveryDate(parentIndex);
                    $scope.parentIndex = parentIndex;
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

            $scope.handleOutSideClick = function() {
                $scope.showUserMenuOptions = false;
                $scope.showMoreMenuOptions = false;
            };

            $scope.navigateTo = function(route) {
                $location.url(route);
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

            $scope.paytmFormDetails = null;
            $scope.formUrl = null;
            getPaytmProcessingDetails = function(orderId) {
                userService.getPaytmProcessingDetails(orderId)
                    .then(function(data){ 
                        console.log(data);             
                        if(data.flag == 1){
                            $scope.formUrl = data.Paytm_url;
                            $scope.paytmFormDetails = data.paymentDetails;
                            
                            $scope.paytmFormDetails.EMAIL = "binit@gmail.com";
                            $scope.paytmFormDetails.CUST_ID = 13815;
                            $scope.paytmFormDetails.MOBILE_NO = 9540955646;

                            $scope.paytmFormDetails.TXN_AMOUNT = $scope.paytmFormDetails.TXN_AMOUNT.replace(",", ".");
                            console.log($scope.formUrl);
                            console.log($scope.paytmFormDetails);
                            $timeout(function() {
                                document.getElementById("frmPaytm").action = $scope.formUrl;
                                document.getElementById("frmPaytm").submit();
                            }, 2000);
                        }
                    });
            };

            $scope.isOrderPlaced = false;
            $scope.placeOrder = function() {                
                $scope.isOrderPlaced = true;
                if($scope.paymentMethod == "paytm_cc" 
                    || $scope.paymentMethod == "cashondelivery") {
                    toggleLoader(true);
                    var userId = utility.getJStorageKey("userId"),
                        checkoutDetails = utility.getJStorageKey("checkoutDetails");
                    
                    userService.checkout(userId, $scope.quoteId, checkoutDetails, $scope.paymentMethod)
                        .then(function(data){
                            toggleLoader(false);                 
                            if(data.flag == 1){
                                if($scope.paymentMethod == "paytm_cc") {
                                    getPaytmProcessingDetails(data.OrderID);
                                } else {
                                    utility.deleteJStorageKey("checkoutDetails");
                                    utility.deleteJStorageKey("cartItems");
                                    utility.deleteJStorageKey("quoteId");
                                    $location.url("payment/success/" + data.OrderID);
                                }                            
                            } else {
                                $('#paymentFailed').modal({
                                    backdrop: false,
                                    keyboard: false,
                                    show: true
                                });
                            }
                        });
                }               
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

            getCityList = function() {
                utility.getCityList()
                    .then(function(data){
                        $scope.cityList = data.location;
                        angular.forEach($scope.cityList, function(value, key) {
                            var city = value.city_name.toLowerCase();
                            $scope.cityLocation[city] = false;
                        });
                        console.log($scope.cityLocation);
                        openCitySelectionModal();
                    });
            };

            hideCitySelectionModal = function() {
                $('#myModal').modal('hide');
            };

            $scope.setCityLocation = function(location) {
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

            $scope.toFixedDecimal = function(num) {
                if(angular.isDefined(num)) {
                    num = parseFloat(num);
                    return num.toFixed(2);
                }                
            };

            $scope.isCouponCodeApplied = false;
            $scope.couponAmount = 0.00;
            $scope.couponCode = null;

            $scope.applyCouponCode = function(couponCode) {
                toggleLoader(true);
                productService.applyCoupon(utility.getJStorageKey("userId"), utility.getJStorageKey("quoteId"), couponCode)
                    .then(function(data){
                        console.log(data);
                        toggleLoader(false);
                        if(data.flag == 1) {
                            $scope.invalidCoupon = false;
                            $scope.couponMessage = "";
                            $scope.isCouponCodeApplied = true;
                            $scope.couponAmount = data.CartDetails.you_save;
                            $scope.cartDetails.grand_total = data.CartDetails.grand_total;
                        } else {
                            $scope.invalidCoupon = true;
                            $scope.couponMessage = data.Result;
                        }                      
                    });
            };

            $scope.removeCouponCode = function(couponCode) {
                toggleLoader(true);
                productService.removeCoupon(utility.getJStorageKey("userId"), utility.getJStorageKey("quoteId"), couponCode)
                    .then(function(data){
                        console.log(data);
                        toggleLoader(false);
                        if(data.flag == 1) {
                            $scope.isCouponCodeApplied = false;
                            $scope.couponAmount = data.CartDetails.you_save;
                            $scope.cartDetails.grand_total = data.CartDetails.grand_total;
                        }
                    });
            };

            angular.element(document).ready(function () {
                if(angular.isUndefined(utility.getJStorageKey("selectedCity"))
                    || !utility.getJStorageKey("selectedCity")) {
                    getCityList();
                }                  
            });

        }
    ]);
});