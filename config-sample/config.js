var env = "qa",
	appName = 'grocermax',
	appFolderName = (env == "prod" || env == "qa") ? "/" : "/grocermax/",
	config = {
		"local": {			
			"protocol": "http",
			"domainName": "localhost/staging.grocermax/",
			"port": "",			
			"apiUrl": "http://staging.grocermax.com/api/",
			"appUrl": appFolderName + "scripts/apps/",
			"templateURL" : appFolderName + "templates/",
			"gaID": 'UA-71814451-1',
		},
		"qa": {			
			"protocol": "http",
			"domainName": "localhost/grocermax/",
			"port": "",			
			"apiUrl": "http://qa.grocermax.com/api/",
			"appUrl": appFolderName + "scripts/apps/",
			"templateURL" : appFolderName + "templates/",
			"gaID": 'UA-71814451-1',
		},
		"prod": {			
			"protocol": "https",
			"domainName": "localhost/grocermax/",
			"port": "",			
			"apiUrl": "https://grocermax.com/api/",
			"appUrl": appFolderName + "scripts/apps/",
			"templateURL" : appFolderName + "templates/",
			"gaID": 'UA-71814451-1',
		}
	};

getApplicationUrl = function() {
	var portString = config[env].port ? ":" + config[env].port : "";
	return config[env].protocol + "://" + config[env].domainName + portString + version ;
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
	var version = typeof window["appVersion"] != "undefined"? ( "/" + window["appVersion"]): "";
	return version + config[env].appUrl;
};

getTemplateURL = function() {
	var version = typeof window["appVersion"] != "undefined"? ( "/" + window["appVersion"]): "";
	return version + config[env].templateURL;
};
getGoogleAnayticsID = function() {
	return config[env].gaID;
}