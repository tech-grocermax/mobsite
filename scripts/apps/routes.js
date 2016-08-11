define([], function() {

    // List Name & Singular Name are the new parameter added to each route, to keep a track by 
    // analytics. Please don't remove it and add new when you add a new route (if needed)

    /**
     * Naming convention for list name and singular name
     * 1) If there are parameter in a route then there is a chance that 
     * the route has two outputs, (a) List and (b) Singular(details) page, 
     * So when a parameter is passed to the route the Singular page is loaded
     * and thus singualr name is used for analytics else if it has parameter but does have its
     * value in route the list name is loaded
     * 
     * Also when there is no need for parameter in a route only Singular name is considered!
     */
    return {
        defaultRoutePath: '',
        routes: {            
            '/': {
                templateUrl: templateURL + 'home.html',
                singularName: "Home Screen",
                dependencies: [
                    appURL + 'services/serverUtility',
                    appURL + 'services/utility',
                    appURL + 'services/category',
                    appURL + 'services/product',
                    appURL + 'directives/generic',                    
                    appURL + 'controllers/category'
                ]
            },
            '/category/:categoryId': {
                templateUrl: templateURL + 'category.html',
                singularName: "Product Category L2",
                dependencies: [
                    appURL + 'services/serverUtility',
                    appURL + 'services/utility',
                    appURL + 'services/category',
                    appURL + 'services/product',
                    appURL + 'directives/generic',                    
                    appURL + 'controllers/category'
                ]
            },
			
            '/product/:categoryId': {
                templateUrl: templateURL + 'product-listing.html',
                singularName: "Product List",
                dependencies: [
                    appURL + 'services/serverUtility',
                    appURL + 'services/utility',
                    appURL + 'services/product',
                    appURL + 'services/category',
                    appURL + 'filter/product',
                    appURL + 'directives/generic',
                    appURL + 'controllers/product'
                ]
            },
            '/product/deal/:promoId': {
                templateUrl: templateURL + 'product.html',
                singularName: "Deal Description",
                dependencies: [
                    appURL + 'services/serverUtility',
                    appURL + 'services/utility',
                    appURL + 'services/product',
                    appURL + 'services/category',
                    appURL + 'filter/product',
                    appURL + 'directives/generic',
                    appURL + 'controllers/product'
                ]
            },
            '/product': {
                templateUrl: templateURL + 'product-search.html',
                singularName: "Search Results",
                dependencies: [
                    appURL + 'services/serverUtility',
                    appURL + 'services/utility',
                    appURL + 'services/product',
                    appURL + 'services/category',
                    appURL + 'filter/product',
                    appURL + 'directives/generic',
                    appURL + 'controllers/product'
                ]
            },

            '/specialdeal': {
                templateUrl: templateURL + 'specialDeal.html',
                singularName: "Product Category L2",
                dependencies: [
                    appURL + 'services/serverUtility',
                    appURL + 'services/utility',
                    appURL + 'services/category',
                    appURL + 'services/product',
                    appURL + 'filter/product',
                    appURL + 'directives/generic',                    
                    appURL + 'controllers/product'
                ]
            },

            '/product/details/:productId': {
                templateUrl: templateURL + 'product-details.html',
                singularName: "Product Description",
                dependencies: [
                    appURL + 'services/serverUtility',
                    appURL + 'services/utility',
                    appURL + 'services/product',
                    appURL + 'services/category',
                    appURL + 'filter/product',
                    appURL + 'directives/generic',
                    appURL + 'controllers/product'
                ]
            },
            '/cart/:quoteId': {
                templateUrl: templateURL + 'cart.html',
                singularName: "Cart Page",
                dependencies: [
                    appURL + 'services/serverUtility',
                    appURL + 'services/utility',
                    appURL + 'services/product',
                    appURL + 'services/category',
                    appURL + 'filter/product',
                    appURL + 'directives/generic',
                    appURL + 'controllers/product'
                ]
            },
            '/page/:pageName': {
                templateUrl: templateURL + 'page.html',
                dependencies: [
                    appURL + 'services/serverUtility',
                    appURL + 'services/utility',
                    appURL + 'services/category',
                    appURL + 'services/product',
                    appURL + 'directives/generic',                    
                    appURL + 'controllers/category'
                ]
            },
            '/user/:sectionName': {
                templateUrl: templateURL + 'user.html',
                listName: {
                    "profile": "My Profile Header",
                    "editprofile": "Edit my Information",
                    "coinshistory": "Max Coins",
                    "maxmoneyhistory": "Refund Wallet",
                    "orderhistory": "Order History",
                    "address": "Profile > List Shipping Addresses",
                    "addaddress": "Profile > Add Shipping Addresses",
                    "editaddress": "Profile > Edit Shipping Addresses",
                    "changepassword": "Change Password"
                },
                dependencies: [
                    appURL + 'services/serverUtility',
                    appURL + 'services/utility',
                    appURL + 'services/user',
                    appURL + 'services/product',
                    appURL + 'directives/generic',
                    appURL + 'controllers/user'
                ]
            },
            '/user/:sectionName/:orderId': {
                templateUrl: templateURL + 'user.html',
                singularName: "Order Detail",
                dependencies: [
                    appURL + 'services/serverUtility',
                    appURL + 'services/utility',
                    appURL + 'services/user',
                    appURL + 'services/product',
                    appURL + 'directives/generic',
                    appURL + 'controllers/user'
                ]
            },
            '/checkout/:sectionName': {
                templateUrl: templateURL + 'checkout.html',
                listName: {
                    "shipping": "Shipping Address",
                    "billing": "Billing Address",
                    "delivery": "Delivery Details",
                    "payment": "Review Order & Pay",
                },
                dependencies: [
                    appURL + 'services/serverUtility',
                    appURL + 'services/utility',
                    appURL + 'services/user',
                    appURL + 'services/product',
                    appURL + 'directives/generic',
                    appURL + 'controllers/checkout'
                ]
            },
            '/hot-offers': {
                templateUrl: templateURL + 'hot-offers.html',
                dependencies: [
                    appURL + 'services/serverUtility',
                    appURL + 'services/utility',
                    appURL + 'services/category',
                    appURL + 'services/product',
                    appURL + 'directives/generic',                    
                    appURL + 'controllers/category'
                ]
            },
            '/deals/:dealId': {
                templateUrl: templateURL + 'deals.html',
                singularName: "Deal List Page",
                dependencies: [
                    appURL + 'services/serverUtility',
                    appURL + 'services/utility',
                    appURL + 'services/category',
                    appURL + 'services/product',
                    appURL + 'directives/generic',                    
                    appURL + 'controllers/product'
                ]
            },
			'/singlepage/:onePageId': {
                templateUrl: templateURL + 'singleDeal.html',
                singularName: "Single Page Deal List Page",
                dependencies: [
                    appURL + 'services/serverUtility',
                    appURL + 'services/utility',
                    appURL + 'services/category',
                    appURL + 'services/product',
                    appURL + 'directives/generic',                    
                    appURL + 'controllers/product'
                ]
            },
            '/category/offers/:dealCategoryId': {
                templateUrl: templateURL + 'offer.html',
                dependencies: [
                    appURL + 'services/serverUtility',
                    appURL + 'services/utility',
                    appURL + 'services/category',
                    appURL + 'services/product',
                    appURL + 'directives/generic',                    
                    appURL + 'controllers/product'
                ]
            },
            '/payment/success/:orderId': {
                templateUrl: templateURL + 'payment-success.html',
                dependencies: [
                    appURL + 'services/serverUtility',
                    appURL + 'services/utility',
                    appURL + 'directives/generic',                    
                    appURL + 'controllers/order'
                ]
            }
        }
    };
});