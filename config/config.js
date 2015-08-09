var env = "local",
	appName = 'grocermax',
	appVersion = '1.0',
	config = {
		"local": {			
			"protocol": "http",
			"domainName": "localhost/grocermax/",
			"port": "",			
			"apiUrl": "http://dev.grocermax.com/webservice/new_services/index.php/"
		},
		"qa": {			
			"protocol": "http",
			"domainName": "localhost/grocermax/",
			"port": "",			
			"apiUrl": "http://localhost/grocermax-api/"
		},
		"prod": {			
			"protocol": "http",
			"domainName": "localhost/grocermax/",
			"port": "",			
			"apiUrl": "http://localhost/grocermax-api/"
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

console.log(getApplicationUrl());
console.log(getAPIUrl());