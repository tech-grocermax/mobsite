var appURL = '/mobsite/scripts/apps/',
	templateURL = '/mobsite/templates/';

require.config({
    baseUrl: '',
    paths: {
		'angular': 'scripts/libs/angular',
		'angular-route': 'scripts/libs/angular-route',
		'angular-ui': 'scripts/libs/angular-ui',
		'bootstrap': 'scripts/libs/bootstrap.min',
		'app': appURL + 'app'
    },
	shim: {
		'app': {
			deps: ['angular', 'angular-route', 'angular-ui', 'bootstrap']
		},
		'angular-route': {
			deps: ['angular']
		},
		'angular-ui': {
			deps: ['angular']
		}
	}
});

require (['app'], function(app) {
    angular.bootstrap(document, ['app']);
});