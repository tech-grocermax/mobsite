define([], function() {
    return {
        defaultRoutePath: '',
        routes: {            
            '/': {
                templateUrl: templateURL + 'home.html',
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
            '/product/deal/:dealId': {
                templateUrl: templateURL + 'product.html',
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
            '/product/details/:productId': {
                templateUrl: templateURL + 'product-details.html',
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
                    appURL + 'directives/generic',
                    appURL + 'controllers/page'
                ]
            },
            '/user/:sectionName': {
                templateUrl: templateURL + 'user.html',
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
                dependencies: [
                    appURL + 'services/serverUtility',
                    appURL + 'services/utility',
                    appURL + 'services/category',
                    appURL + 'services/product',
                    appURL + 'directives/generic',                    
                    appURL + 'controllers/category'
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
                    appURL + 'controllers/category'
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
            },
        }
    };
});