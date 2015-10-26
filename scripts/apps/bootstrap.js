var appURL = '/grocermax/scripts/apps/',
	templateURL = '/grocermax/templates/'; //mobsite

require.config({
    baseUrl: '',
    paths: {
		'angular': 'scripts/libs/angular',
		'angular-route': 'scripts/libs/angular-route',
		'angular-ui': 'scripts/libs/angular-ui',
		'bootstrap': 'scripts/libs/bootstrap.min',
		'angular-endless-scroll': 'scripts/libs/angular-endless-scroll.min',
		'app': appURL + 'app'
    },
	shim: {
		'app': {
			deps: ['angular', 'angular-route', 'angular-ui', 'bootstrap', 'angular-endless-scroll']
		},
		'angular-route': {
			deps: ['angular']
		},
		'angular-ui': {
			deps: ['angular']
		},
		'angular-endless-scroll': {
			deps: ['angular', 'angular']
		}
	}
});

require (['app'], function(app) {
    angular.bootstrap(document, ['app']);
});
