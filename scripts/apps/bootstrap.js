var appURL = '/scripts/apps/',
	templateURL = '/templates/'; //mobsite

require.config({
    baseUrl: '',
    paths: {
		'angular': 'scripts/libs/angular',
		'angular-route': 'scripts/libs/angular-route',
		'angular-ui': 'scripts/libs/angular-ui',
		'bootstrap': 'scripts/libs/bootstrap.min',
		'angular-endless-scroll': 'scripts/libs/angular-endless-scroll.min',
		'angular-touch': 'scripts/libs/angular-touch.min',
		'angular-carousel': 'scripts/libs/angular-carousel',		
		'app': appURL + 'app'
    },
	shim: {
		'app': {
			deps: ['angular', 'angular-route', 'angular-ui', 'bootstrap', 'angular-endless-scroll', 'angular-touch', 'angular-carousel']
		},
		'angular-route': {
			deps: ['angular']
		},
		'angular-ui': {
			deps: ['angular']
		},
		'angular-endless-scroll': {
			deps: ['angular']
		},
		'angular-touch': {
			deps: ['angular']
		},
		'angular-carousel': {
			deps: ['angular']
		}
	}
});

require (['app'], function(app) {
    angular.bootstrap(document, ['app']);
});
