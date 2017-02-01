define(['app'], function(app) {
    app.controller('checkoutController',  [
        '$scope', '$rootScope', '$routeParams', '$location', '$timeout', 'userService', 'productService', 'utility', '$analytics',
        function($scope, $rootScope, $routeParams, $location, $timeout, userService, productService, utility, $analytics) {
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
            $scope.billingAsShipping = "true";
            $scope.isUserLoggedIn = angular.isDefined(utility.getJStorageKey("userId")) && utility.getJStorageKey("userId") ? true : false;
            $scope.cartItems = [];
            $scope.cartItemCount = 0;
            angular.element('body').css('overflow', 'auto');
            $scope.quoteId = angular.isDefined(utility.getJStorageKey("quoteId")) && utility.getJStorageKey("quoteId") ? utility.getJStorageKey("quoteId") : null;
            if(!$scope.quoteId) {
                $location.path("/");
            }
            /*if(utility.getJStorageKey("userId")){
                dataLayer = [{'userID' : utility.getJStorageKey("userId")}];
            }*/
            $scope.youSaved = 0;
            $scope.totalCartQty = 0;
            $scope.grandTotal = 0;
            $scope.paymentMethod = null;
            $scope.paymentMethodWallet = null;
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
            $scope.orderId = angular.isDefined($routeParams.orderId) ? $routeParams.orderId : null;  
            $scope.orderStatus = angular.isDefined($routeParams.status) ? $routeParams.status : null;
			$scope.tempCartCounter = utility.getJStorageKey("tempCartCounter");
			$scope.tempyouSaved = utility.getJStorageKey("tempyouSaved");
			$scope.tempCartVal = utility.getJStorageKey("tempCartVal");
			$scope.tempcouponValue = utility.getJStorageKey("tempcouponValue");
			$scope.tempshippingValue = utility.getJStorageKey("tempShipVal");
            toggleLoader = function(flag) {
                $scope.displayLoader = flag;
            };  
            $scope.MaxMoneyBalance = 0;

            if($scope.section.shipping) {
                $scope.categoryName = "Delivery Address";
                $scope.columnSize = 10;
            } /*else if($scope.section.billing) {
                $scope.categoryName = "Select Billing Address";
                $scope.columnSize = 10;
            }*/ else if ($scope.section.delivery) {
                $scope.categoryName = "Delivery Details";
                $scope.columnSize = 10;
            } else if ($scope.section.payment) {
                $scope.categoryName = "Select Payment Method";
                $scope.columnSize = 10;
            }

            var refineShippingAddress = function() {
                var shippingAddress = [],
                    //regionId = utility.getJStorageKey("regionId");
					selectedCity = utility.getJStorageKey("selectedCity");/*MUSTAKEEM*/
                
                angular.forEach($scope.addressList, function(value, key){
                    /*if(value.region_id == regionId) {
                        shippingAddress.push(value);
                    }*/
					if(value.city == selectedCity){/*MUSTAKEEM*/
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
                    savedAmont = savedAmont + parseInt(value.qty) * parseFloat($scope.getPriceDifference(value.mrp, value.price));
                    qty = qty + parseInt(value.qty);
                });
                $scope.youSaved = savedAmont;
                $scope.totalCartQty = qty;                
            };

            var flushData = function() {
                utility.deleteJStorageKey("checkoutDetails");
                utility.deleteJStorageKey("cartItems");
                utility.deleteJStorageKey("quoteId");
                utility.setJStorageKey("cartCounter" + $scope.quoteId, 0, 1);
                utility.deleteJStorageKey("quoteId");
				utility.deleteJStorageKey("tempCartCounter"); 
				utility.deleteJStorageKey("tempCartVal"); 
				utility.deleteJStorageKey("tempcouponValue");
				utility.deleteJStorageKey("tempyouSaved"); 
				utility.deleteJStorageKey("tempShipVal"); 
                utility.deleteJStorageKey("couponCode");
                $scope.quoteId = null;
                $scope.cartItemCount = 0;
            };

            var handlePaymentResponse = function() {
                if($scope.orderId) {
                    if($scope.orderStatus == 'TXN_SUCCESS') {
                        $('#paymentSuccess').modal({
                            backdrop: false,
                            keyboard: false,
                            show: true
                        });
                        try{
                            userService.trackorderdetails($scope.orderId).then(function(data){
                                if(data.flag==1){
                                    try{   

                                    clevertap.event.push("Charged", {
                                        "Order" :"order successful",
                                        "Amount": $scope.tempCartVal,
                                        "Payment mode": "paytm_cc",
                                        "Charged ID": data.newgtm.transactionId, // important to avoid duplicate transactions due to network failure
                                        "Order ID" : $scope.orderId
                                       });

                                        var payregtm = "OrderId=" + data.newgtm.transactionId +"/userId="+ utility.getJStorageKey("userId");
                                        dataLayer.push('send', { hitType: 'event',  eventCategory: 'Mobile Order Successful', 
                                                        eventAction: "paytm_cc", eventLabel: payregtm}
                                                    );console.log("Mobile Order Successful"); console.log(dataLayer);
                                        }catch(err){console.log("Error in GTM fire.");}
                                    dataLayer.push(data.newgtm);
                                }
                            });
                        }catch(err) { console.log(err); }
                        flushData();
                    }

                    if($scope.orderStatus == 'TXN_FAILURE') {
                        $('#paymentFailed').modal({
                            backdrop: false,
                            keyboard: false,
                            show: true
                        });
                         try{ 
                            clevertap.event.push("Charged", {
                                        "Device": "M-Site",
                                        "Order" :"order Failure",
                                        "Amount": $scope.tempCartVal,
                                        "Payment mode": "paytm_cc",
                                        "Charged ID": data.newgtm.transactionId, // important to avoid duplicate transactions due to network failure
                                        "Order ID" : $scope.orderId
                                       });    
                            var paytmfailgtm = "userId="+ utility.getJStorageKey("userId");
                            dataLayer.push('send', { hitType: 'event',  eventCategory: 'Mobile Order Failure', 
                                            eventAction: "paytm_cc", eventLabel: paytmfailgtm}
                                        );console.log("Mobile Order Failure"); console.log(dataLayer);
                            }catch(err){console.log("Error in GTM fire.");}
                        flushData();
                    }                    
                }
            };            
          
            getCartItemDetails = function() {
                toggleLoader(true);
                if(utility.getJStorageKey("userId")){
                    userService.getWalletBalance(utility.getJStorageKey("userId")).then(function(data){
                        if(data.flag == 1){
                            $scope.MaxMoneyBalance = data.Balance;
                        }
                    });
                }
                productService.getCartItemDetails($scope.quoteId)
                    .then(function(data){  
                        toggleLoader(false);            
                        $scope.cartDetails = data.CartDetail; 
						$scope.TotalItem = data.TotalItem;
                        getYouSaveAmout();
                        $scope.couponValue = parseInt((data.CartDetail.subtotal - data.CartDetail.subtotal_with_discount));
                            if(data.CartDetail.coupon_code){
                                $scope.invalidCoupon = false;
                                $scope.invalidCouponBlank = false;
                                $scope.couponMessage = "";
                                $scope.isCouponCodeApplied = true;
                                $scope.couponCode = data.CartDetail.coupon_code;
                                $scope.couponAmount = data.CartDetail.you_save;
                                $scope.cartDetails.grand_total = data.CartDetail.grand_total;
                                $scope.grandTotal = data.CartDetail.grand_total;
                                $scope.couponModalShow = false;
								$scope.subtotalAmount = data.CartDetail.subtotal;
                            }
                        handlePaymentResponse();
                    });
            };  

            if($scope.sectionName == "payment"){
                getCartItemDetails(); 
            }  

            if(angular.isDefined(utility.getJStorageKey("cartItems")) 
                && utility.getJStorageKey("cartItems")) {
                getCartDetails();
            }

            $scope.creditMethod = false;
            $scope.MaxMoneyBalanceEnough = false;
            $scope.customercreditPaymentMethod = function(creditMethod,MaxMoneyBalance,grndTotal){
                
                if(MaxMoneyBalance >= grndTotal){
                    $scope.MaxMoneyBalanceEnough = true;
                    $scope.disSelectPaymentMethid();
                    $scope.paymentMethod = 'cashondelivery';
                    $scope.paymentMethodWallet = 'cashwallet';
                }else{
                    $scope.MaxMoneyBalanceEnough = false;
                }

                if($scope.creditMethod == true){
                 $scope.creditMethod = false;
                 $scope.paymentMethod = '';
                 $scope.paymentMethodWallet = '';
                 $scope.disSelectPaymentMethid();
                }else{
                    $scope.creditMethod = true;
                }
                
            }
            $scope.disSelectPaymentMethid = function(paymentMethod, model) {
                angular.forEach($scope.payment, function(value, key){
                    $scope.payment[key] = false;
                });
            };

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

                //$analytics.eventTrack($scope.selectedCity, {  category: "Shipping address" });
                try{ 
                    angular.forEach(utility.getJStorageKey("cartItems"), function(value, key){

                        console.log(key + " -- scope billing--> " + value);
                    });  
                     
                    console.log(" -- log start -- " + utility.getJStorageKey("cartItems") );
                    // angular.forEach($scope.cartDetails, function(value, key){
                    //     console.log(key + " checkout billing " + value);
                    // });

                    // angular.forEach($scope, function(value, key){
                    //     console.log(key + " -- scope billing--> " + value);
                    // });

                    var billingName = checkoutDetails[quoteId].billingAddress.firstname + " " + checkoutDetails[quoteId].billingAddress.lastname;
                    var billingStreet = checkoutDetails[quoteId].billingAddress.street;
                    var billingTelephone = checkoutDetails[quoteId].billingAddress.telephone;
                    var billingCity = checkoutDetails[quoteId].billingAddress.city;
                    var billingCompany = checkoutDetails[quoteId].billingAddress.company;

                    var shippingName = checkoutDetails[quoteId].shippingAddress.firstname + " " + checkoutDetails[quoteId].billingAddress.lastname;
                    var shippingStreet = checkoutDetails[quoteId].shippingAddress.street;
                    var shippingTelephone = checkoutDetails[quoteId].shippingAddress.telephone;
                    var shippingCity = checkoutDetails[quoteId].shippingAddress.city;
                    var shippingCompany = checkoutDetails[quoteId].shippingAddress.company;
                    
                    clevertap.profile.push({
                                "Site": {
                                    "Address": "Shipping",                  
                                    "Shipping Name": shippingName,          
                                    "Shipping Street": shippingStreet, 
                                    "shipping Telephone": "+91" + shippingTelephone,
                                    "Shipping City" : shippingCity,
                                    "Shipping Company" : shippingCompany

                                }
                            });
                    clevertap.profile.push({
                                "Site": {
                                    "Address": "Billing",                  
                                    "Billing Name": billingName,          
                                    "Billing Street": billingStreet, 
                                    "Billing Telephone": "+91" + billingTelephone,
                                    "Billing City" : billingCity,
                                    "Billing Company" : billingCompany

                                }
                            });
                    clevertap.event.push("Shipping", {
                            "Device": "M-Site",
                            "Coupon Code" : utility.getJStorageKey("couponCode"), //$scope.cartDetails.coupon_code,
                            "Subtotal" :  parseFloat($scope.tempCartVal).toFixed(2),
                            "Quantity" :  $scope.tempCartCounter                        
                        });
                    clevertap.event.push("Billing", {
                            "Device": "M-Site",
                            "Coupon Code" : utility.getJStorageKey("couponCode"),//$scope.cartDetails.coupon_code,
                            "Subtotal" :  parseFloat($scope.tempCartVal).toFixed(2),
                            "Quantity" :  $scope.tempCartCounter                          
                        });  
                   var selectshipgtm = "UserId=" + utility.getJStorageKey("userId")+"/customerEmail="+ utility.getJStorageKey("email");
                    dataLayer.push('send', { hitType: 'event',  eventCategory: 'Mobile Checkout Funnel', 
                        eventAction: 'Shipping', eventLabel: selectshipgtm}
                    );console.log("Shipping data ..." + $scope.tempCartVal + " qty "  + $scope.tempCartCounter ); console.log(dataLayer);
                }catch(err){console.log("Error in GTM fire."+ err);}

                if($scope.billingAsShipping) {
                    $location.url("checkout/delivery");
                } else {
                    $location.url("checkout/billing");
                }
            };
            
            $scope.selectBillingAddress = function() {
                console.log("billing fore");
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

                try{  
                      
                    clevertap.event.push("Billing", {
                            "Device": "M-Site",
                            "Coupon Code" : $scope.cartDetails.coupon_code,
                            "Subtotal" :  parseFloat($scope.tempCartVal).toFixed(2),
                            "Quantity" :  $scope.tempCartCounter                          
                        }); 
                    }catch(err){
                        console.log("Error in GTM fire.");
                    }              
                
                var quoteId = utility.getJStorageKey("quoteId"),
                    checkoutDetails = utility.getJStorageKey("checkoutDetails");

                checkoutDetails[quoteId].billingAddress = billingAddress;                
                utility.setJStorageKey("checkoutDetails", checkoutDetails, 1);
                //$analytics.eventTrack($scope.selectedCity, {  category: "Billing address" });
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
                    && $scope.parentIndex >=0;
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

                //$analytics.eventTrack($scope.selectedCity, {  category: "Delivery details" });

                $location.url("checkout/payment");
                try{    

                    clevertap.event.push("Delivery Slot", {
                            "Device": "M-Site",
                            //"Email" :  utility.getJStorageKey("email"),
                            "Delivery Slot" :  $scope.selectedDeliveryDate + " " + $scope.selectedDeliveryTime                         
                        }); 
                    var payshipgtm = "UserId=" + utility.getJStorageKey("userId")+"/customerEmail="+ utility.getJStorageKey("email");
                    dataLayer.push('send', { hitType: 'event',  eventCategory: 'Mobile Checkout Funnel', 
                        eventAction: 'Delivery Slot', eventLabel: payshipgtm}
                    );console.log("Delivery Slot");
                }catch(err){console.log("Error in GTM fire.");}
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
			
			$scope.navigateToOrder = function(route) {
				flushData();
                $location.url(route);
            };

            hidePaymentFailedModal = function() {
                $('#paymentFailed').modal('hide');
            };

            $scope.retryPayment = function() {
                $location.search("orderId", null);
                $location.search("status", null);
                hidePaymentFailedModal();
                if(!$scope.orderId) {
                    $scope.placeOrder();
                }                
            };

            $scope.payViaCOD = function() {
                $location.search("orderId", null);
                $location.search("status", null);
                hidePaymentFailedModal();
                $scope.paymentMethod = "cashondelivery";
                $scope.placeOrder();
            };

            var getPayTMCallbackUrl = function() {
                var currentHref = location.href;
                var domainName = currentHref.replace($location.path(), "");
                var callBackUrl = domainName + "/payment/response";
                //console.log(callBackUrl);
                return callBackUrl;
            };            

            $scope.paytmFormDetails = null;
            $scope.formUrl = null;
            getPaytmProcessingDetails = function(orderId, userId, mobileNo) {
                toggleLoader(true); 
                userService.getPaytmProcessingDetails(orderId, userId, utility.getJStorageKey("email"), mobileNo)
                    .then(function(data){ 
                        if(data.flag == 1){
                            $scope.formUrl = data.Paytm_url;
                            $scope.paytmFormDetails = data.paymentDetails; 
                            $scope.paytmFormDetails.EMAIL = utility.getJStorageKey("email");
                            $scope.paytmFormDetails.CUST_ID = userId;
                            $scope.paytmFormDetails.MOBILE_NO = mobileNo;
                            $scope.paytmFormDetails.TXN_AMOUNT = $scope.paytmFormDetails.TXN_AMOUNT.replace(",", "");
                            
                            toggleLoader(false); 
                            //$scope.paytmFormDetails.CALLBACK_URL = location.href;
                            //console.log($scope.paytmFormDetails);
                            $timeout(function() {
                                document.getElementById("frmPaytm").action = $scope.formUrl;
                                document.getElementById("frmPaytm").submit();
                            }, 2000);
                        }
                    });
            };
			
			$scope.duplicateorderbtn = false;
            $scope.isOrderPlaced = false;
            $scope.isHidePlacedBtn =false;
            $scope.placeOrder = function() { 
                //$analytics.eventTrack($scope.selectedCity, {  category: "Review and Place order" });
                try{ 
                    var paymentMethod = null;
                    if($scope.creditMethod){
                        if($scope.MaxMoneyBalance >= $scope.cartDetails.grand_total )
                                paymentMethod = "cashwallet";
                            else
                                paymentMethod = "cashondelivery";   
                    }else{
                         paymentMethod = "cashondelivery";
                         console.log("hello Payment Method ");
                    }

                    // clevertap.event.push("Payment Method", {
                    //         "Device": "M-Site",
                    //         "Payment Method" :  paymentMethod                         
                    //     });   
                    var placshipgtm = "UserId=" + utility.getJStorageKey("userId")+"/customerEmail="+ utility.getJStorageKey("email");
                    dataLayer.push('send', { hitType: 'event',  eventCategory: 'Mobile Checkout Funnel', 
                        eventAction: 'Payment Method', eventLabel: placshipgtm}
                    );console.log("Payment Method "+ $scope.MaxMoneyBalance +" payment "+ $scope.paymentMethod + " wallet-- " + $scope.paymentMethodWallet +" credit "+ $scope.creditMethod);
                }catch(err){console.log("Error in GTM fire.");}
                
                $scope.isOrderPlaced = true;
                if($scope.paymentMethod == "paytm_cc" 
                    || $scope.paymentMethod == "cashondelivery") {
                    toggleLoader(true);
                    $scope.isHidePlacedBtn =true;
                    var userId = utility.getJStorageKey("userId"),
                        checkoutDetails = utility.getJStorageKey("checkoutDetails");
                    userService.checkout(userId, $scope.quoteId, checkoutDetails, $scope.paymentMethod, $scope.creditMethod)
                        .then(function(data){
                            toggleLoader(false);
                            if(data.flag == 1){
                                if($scope.paymentMethod == "paytm_cc") { 
                                    getPaytmProcessingDetails(data.OrderID, userId, checkoutDetails[$scope.quoteId]["shippingAddress"].telephone);
                                } else {                                    
                                    flushData();
                                    handlePaymentResponse();
                                    try{
                                        
                                    userService.trackorderdetails(data.OrderID).then(function(data){
                                        if(data.flag==1){
                                            try{  
                                                
                                                var myJsonString = JSON.stringify(data.newgtm.transactionProducts);
                                                clevertap.event.push("Charged", {
                                                    "Device": "M-Site",
                                                    //"Order" :"Order Successful",
                                                    "Amount": $scope.tempCartVal,
                                                    "Payment mode": paymentMethod,
                                                    "Charged ID": data.newgtm.transactionId, // important to avoid duplicate transactions due to network failure
                                                    //"Order ID" : data.newgtm.transactionId,
                                                    //"Coupon Code" : $scope.cartDetails.coupon_code,
                                                    "Subtotal" : parseFloat($scope.cartDetails.grand_total).toFixed(2),
                                                    //"Quantity" : $scope.cartDetails.items_count,
                                                    "Items": [
                                                            {
                                                                "Quantity": 8,
                                                                "Category": "Books",
                                                                "Book name": "The Millionaire next door",
                                                                
                                                            },
                                                            {
                                                                "Category": "Books",
                                                                "Book name": "Achieving inner zen",
                                                                "Quantity": 7
                                                            },
                                                            {
                                                                "Category": "Books",
                                                                "Book name": "Chuck it, let's do it",
                                                                "Quantity": 5
                                                            }
                                                        ]
                                                   });
                                                console.log(myJsonString);
                                                console.log("--------item log-----");
                                                console.log(clevertap.event);
                                                clevertap.event.push("Place Order", {
                                                    "Device": "M-Site",
                                                    "Payment Method" :  paymentMethod,
                                                    "Order id": data.newgtm.transactionId,
                                                    "Subtotal" :  parseFloat($scope.cartDetails.grand_total).toFixed(2),
                                                    "Coupon Code" : $scope.cartDetails.coupon_code,
                                                    "Quantity" : $scope.cartDetails.items_count              
                                                });
                                                var codshipgtm = "OrderId=" + data.newgtm.transactionId +"/userId="+ utility.getJStorageKey("userId");
                                                dataLayer.push('send', { hitType: 'event',  eventCategory: 'Mobile Order Successful', 
                                                        eventAction: $scope.paymentMethod, eventLabel: codshipgtm}
                                                    );console.log("Mobile Order Successful "+ data.OrderID + " subtotal " + $scope.cartDetails.grand_total); 
                                                  console.log(data.productinfo);
                                            }catch(err){console.log("Error in GTM fire.");}
                                            console.log(data.newgtm);
                                            //console.log(dataLayer);
                                        }
                                    });
                                    }catch(err) { console.log(err); }

                                    $location.url("payment/success/" + data.OrderID);
                                }
                            } 
							
							else if(data.flag == 3){
								$('#cartOutOfStockItem').modal({
                                    backdrop: false,
                                    keyboard: false,
                                    show: true
                                });
								$scope.resultOss = data.Result;
								$scope.buttonOss = data.Button;
								$scope.quate_id_Oss = data.quote_id;
							}
							else if(data.flag == 0) {
                                //$analytics.eventTrack($scope.selectedCity, {  category: "Order Failed" });
                                //$analytics.pageTrack("Failure Screen");
                                $('#paymentFailed').modal({
                                    backdrop: false,
                                    keyboard: false,
                                    show: true
                                });
                                try{
                                    clevertap.event.push("Charged", {
                                                    "Device": "M-Site",
                                                    "Order" :"Order Failed",
                                                    "Amount": $scope.tempCartVal,
                                                    "Payment mode": $scope.paymentMethod,
                                                    "Charged ID": data.newgtm.transactionId, // important to avoid duplicate transactions due to network failure
                                                    "Order ID" : data.newgtm.transactionId,
                                                    "Coupon Code" : $scope.cartDetails.coupon_code,
                                                    "Subtotal" : parseFloat($scope.cartDetails.grand_total).toFixed(2),
                                                    "Quantity" : $scope.cartDetails.items_count
                                                   });
                                }catch(err){console.log("Error in Charged fire.");}
                            }
							
							else if(data.flag == 2){
								$('#cartOutOfStockItem').modal({
                                    backdrop: false,
                                    keyboard: false,
                                    show: true
                                });
								$scope.resultOss = data.Result;
								$scope.duplicateorderbtn = true;
								$scope.buttonDuplicate = data.Button;
								flushData();
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
                $scope.selectedCity = city;
                utility.setJStorageKey("selectedCity", city, 1);
                utility.setJStorageKey("selectedCityId", location.id, 1);                
                utility.setJStorageKey("stateName", location.default_name, 1);
                utility.setJStorageKey("regionId", location.region_id, 1);
                // added for clearing cart - Pradeep
                if(location.storeid != utility.getJStorageKey("storeId")) {
                    utility.setJStorageKey("cartCounter" + $scope.quoteId, 0, 1);
                    utility.deleteJStorageKey("quoteId");
                    $scope.quoteId = null;
                    $scope.cartItemCount = 0;
                } 
                utility.setJStorageKey("storeId", location.storeid, 1);
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
                try{ 
                    clevertap.event.push("View Cart", {
                            "Device": "M-Site",
                            "Subtotal": $scope.grandTotal,
                            "Quantity": $scope.cartItemCount,
                            "Coupon Code" : utility.getJStorageKey("couponCode"),
                        });
                    var QgtmCart ="UserId=" + utility.getJStorageKey("userId") + "/CartQty="+ $scope.cartItemCount;
                    dataLayer.push('send', { hitType: 'event', eventCategory: 'Mobile View Cart', 
                        eventAction: 'Cart Details', eventLabel: QgtmCart }
                        ); console.log("Cart Open");
                }catch(err){console.log("Error in GTM fire.");}

                if(angular.isDefined(utility.getJStorageKey("quoteId")) 
                    && utility.getJStorageKey("quoteId")) 
				{
                    $location.url("cart" + "/" + utility.getJStorageKey("quoteId"));
                }
            };

            $scope.toFixedDecimal = function(num) {
                if(angular.isDefined(num)) {
                    num = parseFloat(num);
                    return num.toFixed(2);
                }                
            };

            /*$scope.isCouponCodeApplied = false;
            $scope.couponAmount = 0.00;
            $scope.couponCode = null;

            $scope.applyCouponCode = function(couponCode) {
                toggleLoader(true);
                productService.applyCoupon(utility.getJStorageKey("userId"), utility.getJStorageKey("quoteId"), couponCode)
                    .then(function(data){
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
                        toggleLoader(false);
                        if(data.flag == 1) {
                            $scope.isCouponCodeApplied = false;
                            $scope.couponAmount = data.CartDetails.you_save;
                            $scope.cartDetails.grand_total = data.CartDetails.grand_total;
                        }
                    });
            };*/

            angular.element(document).ready(function () {
                if(angular.isUndefined(utility.getJStorageKey("selectedCity"))
                    || !utility.getJStorageKey("selectedCity")) {
                    getCityList();
                }                 
            });

        }
    ]);
});
