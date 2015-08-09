define([], function() {
    return {
        defaultRoutePath: '',
        routes: {
            '/': {
                templateUrl: templateURL + 'product.html',
                dependencies: [
                    appURL + 'services/serverUtility',
                    appURL + 'services/product',
                    appURL + 'filter/product',
                    appURL + 'controllers/product'
                ]
            },
            '/category': {
                templateUrl: templateURL + 'category.html',
                dependencies: [
                    appURL + 'services/serverUtility',
                    appURL + 'services/category',                    
                    appURL + 'controllers/category'
                ]
            }
        }
    };
});