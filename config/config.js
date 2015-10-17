var env = "local",
	appName = 'grocermax',
	appVersion = '1.0',
	config = {
		"local": {			
			"protocol": "http",
			"domainName": "localhost/staging.grocermax/",
			"port": "",			
			"apiUrl": "http://localhost/magento/api/"
			//"apiUrl": "http://staging.grocermax.com/api/"
		},
		"qa": {			
			"protocol": "http",
			"domainName": "localhost/grocermax/",
			"port": "",			
			"apiUrl": "http://localhost/magento/api/"
		},
		"prod": {			
			"protocol": "http",
			"domainName": "localhost/grocermax/",
			"port": "",			
			"apiUrl": "http://localhost/magento/api/"
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