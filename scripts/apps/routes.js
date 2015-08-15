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
                    appURL + 'controllers/category'
                ]
            },
            '/category/:categoryId': {
                templateUrl: templateURL + 'category.html',
                dependencies: [
                    appURL + 'services/serverUtility',
                    appURL + 'services/utility',
                    appURL + 'services/category',                    
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
                    appURL + 'controllers/product'
                ]
            }
        }
    };
});