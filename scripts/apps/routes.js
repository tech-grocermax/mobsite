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
                    appURL + 'directives/generic',                    
                    appURL + 'controllers/category'
                ]
            },
            '/product/:categoryId': {
                templateUrl: templateURL + 'product.html',
                dependencies: [
                    appURL + 'services/serverUtility',
                    appURL + 'services/utility',
                    appURL + 'services/product',
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
                    appURL + 'directives/generic',
                    appURL + 'controllers/user'
                ]
            }
        }
    };
});