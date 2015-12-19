var env = "prod",
	appName = 'grocermax',
	appVersion = '1.0',
	config = {
		"local": {			
			"protocol": "http",
			"domainName": "localhost/staging.grocermax/",
			"port": "",			
			"apiUrl": "http://staging.grocermax.com/api/",
			"appUrl": "/grocermax/scripts/apps/",
			"templateURL" : "/grocermax/templates/"
		},
		"qa": {			
			"protocol": "http",
			"domainName": "localhost/grocermax/",
			"port": "",			
			"apiUrl": "http://staging.grocermax.com/api/",
			"appUrl": "/scripts/apps/",
			"templateURL" : "/grocermax/templates/"
		},
		"prod": {			
			"protocol": "https",
			"domainName": "localhost/grocermax/",
			"port": "",			
			"apiUrl": "https://grocermax.com/api/",
			"appUrl": "/scripts/apps/",
			"templateURL" : "/templates/"
		}
	};

getApplicationUrl = function() {
	var portString = config[env].port ? ":" + config[env].port : "";
	return config[env].protocol + "://" + config[env].domainName + portString ;
};

getAPIUrl = function() {
	return config[env].apiUrl;
};

getAPIFullUrl = function() {
	return getAPIUrl();
};

getCurrentVersion = function() {
	return applicationVersion;
};

getAppUrl = function() {
	return config[env].appUrl;
};

getTemplateURL = function() {
	return config[env].templateURL;
};